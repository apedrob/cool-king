import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default tseslint.config(
    {
        ignores: [
            "**/dist/",
            "**/node_modules/",
            "old/",
            "client/old-phaser/",
            "**/*.js",
        ],
    },
    ...tseslint.configs.recommended,
    ...svelte.configs.recommended,
    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_|^\\$\\$",
                },
            ],
            "svelte/no-at-html-tags": "off",
        },
    },
);
