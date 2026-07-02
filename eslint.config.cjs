// Flat config ESLint (9.x) — lint des composants OWL des modules Odoo.
// Portée : assets web `static/src/**/*.js`. La règle du plugin OWL exige la déclaration des `props`.
// Le plugin (@odoo/eslint-plugin-owl 1.1.0) est résolu via NODE_PATH (installé en global dans la
// cellule ; via additional_dependencies en pre-commit CI). Synchro versions : Dockerfile + .pre-commit-config.yaml.
const owl = require("@odoo/eslint-plugin-owl");

module.exports = [
    {
        files: ["**/static/src/**/*.js"],
        languageOptions: { ecmaVersion: 2023, sourceType: "module" },
        plugins: { "@odoo/owl": owl },
        rules: {
            "@odoo/owl/force-component-props-declaration": ["error", { ignoreGlobs: ["**/tests/**"] }],
        },
    },
];
