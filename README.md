# odoo-quality-ci — règles qualité communes (Odoo, tous clients)

Source unique des règles de qualité appliquées à tout le code Odoo produit. Consommé par la **CI GitHub**
de chaque repo client (workflow réutilisable) et **miroir** du dossier `standards/odoo/` de l'orchestrateur
(qui, lui, bake ces configs dans la cellule pour le gate machine avant push). Voir `STANDARDS.md`.

## Utilisation (repo client)
Un caller minimal (injecté automatiquement à l'onboarding par l'orchestrateur) :
```yaml
# .github/workflows/quality.yml
name: quality
on:
  pull_request:
    types: [opened, edited, synchronize, reopened]
jobs:
  quality:
    uses: Barramine64/odoo-quality-ci/.github/workflows/quality.yml@v1
    permissions:
      contents: read
      pull-requests: read
```
Le workflow réutilisable récupère la config canonique **à la version qu'il a lui-même** (`job_workflow_sha`),
la pose à la racine, et lance `pre-commit` en **delta** (fichiers changés) + vérifie le titre de PR.

## Versionnage
Tags immuables `v1.0.0`, `v1.1.0`… + alias mobile **`v1`** (les callers pinnent `@v1`). Valider tout bump de
`rev:`/version sur un repo canari via `@main` avant d'avancer `v1` → on ne casse jamais tous les repos d'un coup.
Les versions doivent rester alignées avec `deploy/cellule.Dockerfile` de l'orchestrateur (parité cellule ↔ CI).

## Local
```bash
git clone --depth 1 --branch v1 https://github.com/Barramine64/odoo-quality-ci ._quality
cp ._quality/.pre-commit-config.yaml ._quality/ruff.toml ._quality/.pylintrc \
   ._quality/eslint.config.cjs ._quality/.prettierrc .
uvx pre-commit run --from-ref origin/dev --to-ref HEAD
```

## Front (JS/OWL)
Actif : ESLint (+ `@odoo/eslint-plugin-owl`) + Prettier sur `static/src`. Étendre les règles OWL dans
`eslint.config.cjs` au besoin.
