import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import eslint from '@eslint/js'
import vueEslintParser from 'vue-eslint-parser'
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: ['node_modules'],
    files: [ '**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.js' ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: vueEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/quotes': [ 'error', 'single' ],
      '@stylistic/semi': [ 'error', 'never' ],
      '@stylistic/arrow-parens': [ 'error', 'always' ],
      '@stylistic/linebreak-style': [ 'error', 'unix' ],
      '@stylistic/no-tabs': ['error'],
      '@stylistic/array-bracket-spacing': [ 'error', 'always', { singleValue: false} ],
      '@stylistic/jsx-quotes': [ 'error', 'prefer-double' ],
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@stylistic/space-before-function-paren': [ 'error', 'never' ],
      '@stylistic/no-trailing-spaces': ['error'],
      '@stylistic/no-multiple-empty-lines': [ 'error', { max: 1 } ],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/comma-spacing': ['error'],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
    },
  },
]
