# Standards de développement Odoo — règles communes à tous les projets clients

> Source de vérité des règles qualité appliquées à **tout** le code Odoo produit (par les agents ou à la
> main). Appliquées à 3 niveaux : (1) le prompt de l'agent, (2) un **gate machine dans la cellule**
> (`run-quality`, avant tout commit), (3) une **CI GitHub** sur chaque PR (miroir `Barramine64/odoo-quality-ci`).
> Les fichiers de ce dossier (`ruff.toml`, `.pylintrc`, `eslint.config.cjs`, `.prettierrc`,
> `.pre-commit-config.yaml`) sont **la config exécutée** — ce document explique le « pourquoi ».

## Outillage
| Domaine | Outil | Rôle |
|---|---|---|
| Python (général) | **ruff** 0.15.20 | format + lint + tri d'imports |
| Python (Odoo) | **pylint-odoo** 10.0.4 | manifeste, `xml_id`, traductions non-lazy, ORM, API dépréciée |
| XML / CSV / PO | **oca-odoo-pre-commit-hooks** 0.2.24 | vues/données : syntaxe, ids, nœuds dépréciés, traductions |
| Front JS/OWL | **ESLint 9** + **@odoo/eslint-plugin-owl** 1.1.0 | règles composants OWL (props déclarées) |
| Front format | **Prettier** 3.9.4 | JS / CSS / SCSS |
| Orchestration | **pre-commit** 4.6.0 | lance tout en CI + en local (la cellule lance les outils en direct) |

## Structure d'un module
```
mon_module/
├─ __manifest__.py        # name, version (19.0.x.y.z), author, license, depends, data — COMPLET
├─ __init__.py
├─ models/                # un fichier par modèle principal
├─ views/                 # vues + actions (xml_id préfixés du module)
├─ security/ir.model.access.csv   # droits d'accès (+ record rules si besoin)
├─ data/ · demo/          # données non-démo / démo
├─ static/src/            # front OWL : composant .js + template .xml SÉPARÉ
└─ tests/                 # tests Odoo tagués
```

## Conventions
- **Python** : `snake_case`, imports en **4 paragraphes** (stdlib / externe / `odoo` / `odoo.addons` — ruff
  `I`, section `[lint.isort]`), pas de `print` (logger), pas de `except: pass`.
- **ORM** : pas de SQL brut injectable (`sql-injection`), `sudo()` justifié, pas d'écriture dans un `compute`,
  méthodes `_compute_*`/`_search_*`/`_inverse_*` nommées, `super()` respecté.
- **Traductions** : **lazy** (`_()` au bon endroit, pas de concaténation/f-string traduite).
- **Manifeste** : `name, version, author, license` présents ; version au format OCA `19.0.MAJOR.MINOR.PATCH`.
- **OWL** : `props` déclarées sur chaque composant ; templates en `.xml` séparés du `.js`.
- **Commits** : **Conventional Commits** — `feat:`, `fix:`, `ci:`, `docs:`, `refactor:`, `test:`, `chore:`
  (le titre de PR devient le commit de squash-merge → il doit être conventionnel).

## Comment ça tourne
- **Cellule (avant push)** : `run-quality <module>` applique l'auto-fix (`ruff format`/`--fix`, `prettier
  --write`) puis gate en dur (ruff/pylint-odoo/OCA/eslint) sur les **fichiers touchés**. Rouge = la tâche
  revient à l'agent (jamais de commit non-conforme).
- **CI GitHub (sur la PR)** : le workflow réutilisable rejoue `pre-commit` en **delta** (base→HEAD) + vérifie
  le titre de PR (Conventional Commits). Voir `Barramine64/odoo-quality-ci`.

## Voir aussi — guidelines hors périmètre du lint
[`../odoo-guidelines/`](../odoo-guidelines/) (dossier **frère**, hors miroir CI) porte les **règles officielles
Odoo que le lint ne peut PAS vérifier** (idiomes ORM, ordonnancement, conception pour l'héritage, sémantique
de sécurité) + les **spécificités de version** (`../odoo-guidelines/versions/`). Servies à la cellule en skill
`odoo-guidelines` (`../odoo-skill/`, ticket #3). Complémentaire, **sans duplication** : ici = imposé par le
lint ; là-bas = jugement/idiome.

## Sync du miroir
Ce dossier est **la source** (il EST le contenu du repo miroir : configs + workflow réutilisable + README).
Le repo `Barramine64/odoo-quality-ci` (consommé par la CI GitHub) en est le **miroir** : à toute évolution
des règles, republier (`bash scripts/publish_quality.sh v1.0.1`) et l'alias `v1` suit. Les pins de version
doivent rester alignés entre `.pre-commit-config.yaml` et `deploy/cellule.Dockerfile` (versions cellule ↔ CI).
