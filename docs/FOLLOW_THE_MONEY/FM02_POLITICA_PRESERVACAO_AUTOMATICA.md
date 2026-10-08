# FM-02 — Política de preservação automática

Adicionados oito alvos documentais à infraestrutura **já existente** em `preservation/targets.json` e `.github/workflows/source-preservation.yml`.

- **Dois termos SEI**: preservar HTTP/metadados/SHA-256 do download via CI, mas não replicar binário PDF no Git público, pois pode conter CPF e outros dados pessoais. A cópia original pode ser arquivada no **Blob privado**, com acesso autenticado no cockpit.
- **Dois registros PNCP**, **duas comunicações municipais de Belo Campo**, **índice SUDESB** e **receita de Jaguaquara**: snapshots integrais quando a fonte responder e respeitar limites de tamanho.
- **Falhas e respostas diferentes**: o coletor registra indisponibilidade ou alteração sem fabricar documentação.
- O índice de preservação exibe capturas realizadas **após execução efetiva do workflow**, jamais antes.
- O extrato FIPLAN original filtrado é armazenado em `preservation/extracts/` e é validado com dois hashes no prebuild.

A alteração em `preservation/targets.json` aciona o workflow de preservação existente após integração no GitHub, sujeito à disponibilidade dos sites e permissões de GitHub Actions. Se houver falha, registrar resposta e prosseguir via requisição documental, nunca reinterpretar como inexistência.
