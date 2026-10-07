# Expansion Wave 02 — 69 municipalities

## Objective

Expand the Observatório Eleitoral Bahia 2026 investigation by 69 new municipalities while preserving a strict separation between **sampling criteria** and **evidence of a potentially unlawful act**.

Voting results are used only to prioritize research coverage. A municipality is never classified as suspicious merely because Jerônimo Rodrigues obtained a high vote share there.

## Current scope

- Existing housing core: 8 municipalities.
- New expansion cohort: 69 municipalities.
- Total municipalities in the combined priority universe: 77.
- Entire Território de Identidade de Irecê: 20/20 municipalities covered when Lapão from the existing core is combined with the 19 new municipalities.
- First central-evidence wave: 50 independently countable documentary facts.
- Prior housing-core evidence: 14.
- New FIPLAN payment facts: 36.
- New FIPLAN financial exposure: R$ 16,444,765.94.

## Selection logic

The 69 new municipalities are the union of:

1. **36 municipalities with payments already identified in the preserved FIPLAN defeso dataset.**
   - These are evidence-bearing municipalities immediately eligible for legal/documentary testing.
2. **19 additional municipalities required to complete the Território de Identidade de Irecê.**
   - Lapão is already in the existing housing core.
   - Cafarnaum, Canarana and Ipupiara overlap with the FIPLAN group.
3. **17 additional municipalities with high proportional vote share for Jerônimo Rodrigues in the 2026 first round.**
   - Vote share is solely a sampling-priority variable.
   - It is not an evidentiary or legal-risk score.

The union is exactly 69 new municipalities because three Irecê municipalities overlap the FIPLAN group.

## Priority tiers

### P0 — documentary trigger already located

36 municipalities.

Entry criterion:
- at least one effective payment in the restricted-period FIPLAN universe already preserved by the project.

Required chain:

`payment → instrument → publication → object → procurement/contract → service order → measurement/physical execution → legal exception test`

For each P0 municipality, test:

- date of instrument execution;
- date of publication;
- payment/NOB date and amount;
- object and funding agency;
- whether the obligation was formally pre-existing before 04/07/2026;
- whether physical execution was already underway before 04/07/2026 when that exception is invoked;
- whether a prefixed execution schedule existed;
- emergency/calamity exception, when applicable, with specific object linkage;
- procurement, supplier, contract, service order, measurement and inspection records;
- TSE crossmatch only after an unequivocal supplier/CNPJ is identified.

### P1 — territorial or electoral-priority sampling

33 municipalities.

Composition:
- 16 Irecê municipalities not already carrying a FIPLAN payment fact in the current restricted-period dataset;
- 17 high-Jerônimo-vote municipalities added for sampling coverage.

P1 does **not** imply suspicion.

Promotion to P0 requires an objective documentary trigger, for example:
- effective transfer/payment in the critical period;
- contract or amendment with relevant execution/payment;
- service order or measurement tied to an election-period transfer;
- procurement with a temporal or financial link requiring legal-exception testing;
- other primary-source fact independently sufficient to open a documentary chain.

## Central evidence — Wave 01

The project freezes exactly 50 central evidence items in:

`preservation/manifests/central-evidence-wave-01-50.json`

Counting rule:
- one independently auditable documentary fact = one central evidence item;
- multiple snapshots, hashes, manifests or certificates supporting the same underlying fact do not increase the central-evidence count;
- negative searches and analytical inferences are supporting evidence states, not automatically additional central evidence;
- the 50 items are **not 50 proven violations** and are **not 50 accusations**.

Composition:
- 8 housing payment facts;
- 5 later housing procurement facts;
- 1 Lapão homologation/result fact;
- 36 additional municipal FIPLAN payment facts.

## Irecê coverage gate

All 20 official municipalities of the Território de Identidade de Irecê must remain visible in the private cockpit:

- América Dourada
- Barra do Mendes
- Barro Alto
- Cafarnaum
- Canarana
- Central
- Gentio do Ouro
- Ibipeba
- Ibititá
- Ipupiara
- Irecê
- Itaguaçu da Bahia
- João Dourado
- Jussara
- Lapão
- Mulungu do Morro
- Presidente Dutra
- São Gabriel
- Uibaí
- Xique-Xique

Lapão remains in the original housing core; the other 19 are represented in the new cohort.

## Execution roadmap

### Phase A — selection and evidence freeze
**Status: complete**

- 69 municipalities selected and versioned.
- 50 central evidence items frozen.
- Private cockpit receives the cohort and evidence registry.
- Vercel preview must remain READY.

### Phase B — P0 legal-documentary triage
**Status: next**

For all 36 P0 municipalities:

1. identify every relevant FIPLAN instrument and payment;
2. classify object and conceding agency;
3. establish instrument/publication dates;
4. locate corresponding procurement/contract;
5. test the applicable legal exception;
6. collect OS, measurement, inspection and physical-execution evidence;
7. preserve primary artifacts with hash and collection metadata;
8. assign one controlled outcome:
   - coherent/documented;
   - pending documents;
   - apparent temporal inversion;
   - divergent object;
   - contracting not located;
   - explained by legal exception.

### Phase C — complete Irecê deep scan

For all 20 municipalities:
- search the whole restricted-period FIPLAN universe;
- search municipal and state transparency sources;
- PNCP and source-system procurements;
- contracts, amendments, service orders and measurements;
- emergency/calamity decrees only when specifically linked to the object;
- candidate/supplier electoral crossmatch only after supplier identity is established.

### Phase D — high-vote control group

For the 17 high-vote municipalities:
- ingest/verify the official 2026 municipal vote result;
- scan for objective financial/procurement triggers;
- retain municipalities with no trigger as controls, not suspicious cases;
- promote only evidence-bearing cases to P0.

### Phase E — referral package

Build the PRE-BA/MPE package with:
- executive chronology;
- legal basis;
- documentary matrix;
- central evidence index;
- hashes and provenance;
- explicit distinction between facts, negative searches, inferences and open links;
- requests for the administrative documents unavailable publicly.

## Promotion gate

Do not promote an allegation merely because:
- a municipality voted heavily for a candidate;
- a procurement occurred after a payment;
- a document was not found in a public search.

A case becomes referral-ready when there is enough primary documentary material to articulate a concrete fact requiring investigation and to identify precisely which missing records the competent authority should request.

Production deployment remains separate from research-preview publication.
