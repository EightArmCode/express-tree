// eslint's new FlatConfig ftw
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'

import parser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

const extraFileExtensions = ['.vue']

const base = tseslint.config(
  // trust the eslint types
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  eslint?.configs?.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
)

const stylisticConfigs = tseslint.config({
  ...stylistic.configs.customize({
    flat: true,
    arrowParens: true,
    pluginName: '@stylistic',
    braceStyle: '1tbs',
  }),
  ...stylistic.configs['recommended-flat'],
  rules: {
    '@stylistic/indent': [
      'error',
      2,
    ],
    '@stylistic/quotes': [
      'error',
      'single',
      { allowTemplateLiterals: true },
    ],
    '@stylistic/semi': [
      'error',
      'never',
    ],
    '@stylistic/arrow-parens': [
      'error',
      'always',
    ],
    '@stylistic/linebreak-style': [
      'error',
      'unix',
    ],
    '@stylistic/no-tabs': ['error'],
    '@stylistic/array-bracket-spacing': [
      'error',
      'always',
      { singleValue: false },
    ],
    '@stylistic/jsx-quotes': [
      'error',
      'prefer-double',
    ],
    '@stylistic/quote-props': [
      'error',
      'as-needed',
    ],
    '@stylistic/space-before-function-paren': [
      'error',
      'never',
    ],
    '@stylistic/no-trailing-spaces': ['error'],
    '@stylistic/no-multiple-empty-lines': [
      'error',
      { max: 1 },
    ],
    '@stylistic/keyword-spacing': ['error'],
    '@stylistic/comma-spacing': ['error'],
    '@stylistic/comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
  },
})

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
export default tseslint.config(
  ...base,
  ...stylisticConfigs,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions,
        ecmaVersion: 'latest',
        sourceType: 'module',
        impliedStrict: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    ignores: [
      'yarn*',
      '.yarn/*',
      '.DS_Store/*',
      'node_modules/*',
      '.vscode/*',
    ],
    files: [
      'public/*.js',
      'server/*.ts',
      'server/**/*.ts',
      'server/**/*.*.ts',
      'cypress/**/*.ts',
      'cypress/**/*.*.ts',
      '*.ts',
      '*.js',
      '*.*.js',
      '*.*.ts',
      '*.d.ts',
      'eslint.config.js',
    ],
    rules: {
      'no-else-return': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': 'error',
      'no-useless-return': 'error',
      'no-undef-init': 'error',
      'no-var': 'error',
      'prefer-object-spread': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'return',
            'export',
            'block-like',
            'multiline-const',
            'function',
          ],
        },
        {
          blankLine: 'any',
          prev: '*',
          next: [
            'import',
            'cjs-import',
          ],
        },
      ],
    },
  },
)
