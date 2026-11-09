import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier: prettier,
        },
        rules: {
            'prettier/prettier': ['error', { tabWidth: 4 }],
        },
    },
];
