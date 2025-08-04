import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Plugin imports
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: "latest",
                sourceType: "module",
            }
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            "import": importPlugin,
            "jsx-a11y": jsxA11yPlugin
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "import/order": [
                "error",
                {
                    "groups": ["builtin", "external", "internal"],
                    "pathGroups": [
                        {
                            "pattern": "react",
                            "group": "external",
                            "position": "before"
                        }
                    ],
                    "pathGroupsExcludeImportType": ["react"],
                    "newlines-between": "always",
                    "alphabetize": {
                        "order": "asc",
                        "caseInsensitive": true
                    }
                }
            ]
        }
    },
    {
        ignores: ["scripts/**/*", "build/**/*", ".next/**/*", "node_modules/**/*"]
    }
];

export default eslintConfig;
