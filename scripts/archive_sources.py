#!/usr/bin/env python3
import hashlib, json, os, pathlib, shutil, sys, tempfile, urllib.request, urllib.error
from datetime import datetime, timezone

ROOT=pathlib.Path(__file__).resolve().parents[1]
TARGETS=ROOT/'preservation'/'targets.json'
MANIFESTS=ROOT/'preservation'/'manifests'
SNAPSHOTS=ROOT/'preservation'/'snapshots'
INDEX=ROOT/'docs'/'source-certificate-index.json'
UA='Observatorio-Eleitoral-Bahia-2026-Preservation/1.0'

MANIFESTS.mkdir(parents=True,exist_ok=True)
SNAPSHOTS.mkdir(parents=True,exist_ok=True)

def now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00','Z')

def canonical(obj):
    return json.dumps(obj,ensure_ascii=False,separators=(',',':'),sort_keys=True)

def certificate(event):
    unsigned={k:v for k,v in event.items() if k!='certificateSha256'}
    return hashlib.sha256(canonical(unsigned).encode()).hexdigest()

def ext_for(content_type,url):
    p=urllib.parse.urlparse(url).path
    suffix=pathlib.Path(p).suffix.lower()
    if suffix and len(suffix)<=8:return suffix
    c=(content_type or '').lower()
    if 'json' in c:return '.json'
    if 'html' in c:return '.html'
    if 'pdf' in c:return '.pdf'
    if 'zip' in c:return '.zip'
    if 'csv' in c:return '.csv'
    return '.bin'

cfg=json.loads(TARGETS.read_text(encoding='utf-8'))
batch=[]
changed=False
for target in cfg['targets']:
    ts=now()
    req=urllib.request.Request(target['url'],headers={'User-Agent':UA,'Accept':'*/*'})
    event={'sourceId':target['id'],'title':target.get('title'),'publisher':target.get('publisher'),'originalUrl':target['url'],'retrievedAt':ts,'retrievalAgent':UA}
    tmp=None
    try:
        with urllib.request.urlopen(req,timeout=60) as resp:
            event['httpStatus']=getattr(resp,'status',200)
            event['finalUrl']=resp.geturl()
            headers={k.lower():v for k,v in resp.headers.items()}
            for key in ['content-type','content-length','etag','last-modified','date','cache-control','content-disposition','server']:
                if key in headers:event[key]=headers[key]
            h=hashlib.sha256(); size=0
            preserve=bool(target.get('preserveRaw'))
            maxraw=int(target.get('maxRawBytes') or 0)
            fd,tmp=tempfile.mkstemp(prefix='oeba-src-'); os.close(fd)
            with open(tmp,'wb') as out:
                while True:
                    chunk=resp.read(1024*1024)
                    if not chunk:break
                    h.update(chunk); size+=len(chunk)
                    if preserve and size<=maxraw:out.write(chunk)
            event['size']=size; event['sha256']=h.hexdigest()
            if preserve and size<=maxraw:
                destdir=SNAPSHOTS/target['id']; destdir.mkdir(parents=True,exist_ok=True)
                name=ts.replace(':','-')+ext_for(headers.get('content-type',''),event['finalUrl'])
                dest=destdir/name
                shutil.move(tmp,dest); tmp=None
                event['rawPreserved']=True
                event['rawPath']=str(dest.relative_to(ROOT))
            else:
                event['rawPreserved']=False
                event['rawReason']='disabled_or_size_limit'
    except Exception as exc:
        event['error']=f'{type(exc).__name__}: {exc}'
        event['available']=False
    finally:
        if tmp and os.path.exists(tmp):os.unlink(tmp)
    if 'error' not in event:event['available']=True
    event['certificateSha256']=certificate(event)

    mp=MANIFESTS/f"{target['id']}.json"
    history=[]
    if mp.exists():
        try:history=json.loads(mp.read_text(encoding='utf-8')).get('history',[])
        except Exception:history=[]
    last=history[-1] if history else None
    materially_new=(not last or last.get('sha256')!=event.get('sha256') or last.get('available')!=event.get('available') or last.get('finalUrl')!=event.get('finalUrl'))
    if materially_new:
        history.append(event)
        mp.write_text(json.dumps({'sourceId':target['id'],'title':target.get('title'),'publisher':target.get('publisher'),'history':history},ensure_ascii=False,indent=2),encoding='utf-8')
        changed=True
    batch.append(event)
    print(target['id'], 'OK' if event.get('available') else 'FAIL', event.get('sha256','-'), event.get('size','-'))

summary=[]
for mp in sorted(MANIFESTS.glob('*.json')):
    data=json.loads(mp.read_text(encoding='utf-8'))
    if data.get('history'):summary.append(data['history'][-1])
root_material='\n'.join(sorted(f"{x['sourceId']}:{x.get('sha256','ERROR')}:{x.get('certificateSha256','')}" for x in summary))
index={'version':1,'generatedAt':now(),'sources':summary,'batchRootSha256':hashlib.sha256(root_material.encode()).hexdigest()}
old=None
if INDEX.exists():
    try:old=json.loads(INDEX.read_text(encoding='utf-8'))
    except Exception:old=None
# Only rewrite index when substantive snapshot state changed.
if changed or old is None:
    INDEX.write_text(json.dumps(index,ensure_ascii=False,indent=2),encoding='utf-8')
print('changed=',changed,'batchRoot=',index['batchRootSha256'])
