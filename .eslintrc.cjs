/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
  },

  plugins: ['@kalimahapps/eslint-plugin-tailwind', '@stylistic/js', 'import'],

  overrides: [
    {
      files: ['./pages/**/*.vue', './components/ui/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.ts'],
      excludedFiles: '*.vue',
      rules: {
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/linebreak-style': ['error', 'unix'],
      },
    },
  ],

  parser: 'vue-eslint-parser',

  rules: {
    '@kalimahapps/tailwind/sort': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    curly: ['off', 'multi'],
    'object-shorthand': ['error', 'always'],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin', // Built-in modules (e.g., fs, path)
          'external', // External modules (e.g., lodash, axios)
          'internal', // Internal modules (e.g., @/components, @/utils)
          'parent', // Parent imports (e.g., ../utils)
          'sibling', // Sibling imports (e.g., ./Button)
          'index', // Index imports (e.g., ./)
          'object', // Object imports (e.g., import { foo, bar } from 'module')
          'type', // Type imports (e.g., import type { Foo } from 'module')
        ],
        pathGroups: [
          {
            pattern: '{react,react-dom/**,vue}',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/js/indent': 'off',
    '@stylistic/js/linebreak-style': 'off',
    '@stylistic/js/newline-per-chained-call': [2, { ignoreChainWithDepth: 1 }],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/semi': [2, 'always'],
    '@stylistic/js/space-before-function-paren': ['error', 'always'],

    // Vue specific tweaks
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'always',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/html-indent': ['error'],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/attributes-order': ['error', {
      'order': [
        "DEFINITION",
        "LIST_RENDERING",
        "CONDITIONALS",
        "RENDER_MODIFIERS",
        "GLOBAL",
        ["UNIQUE", "SLOT"],
        "TWO_WAY_BINDING",
        "OTHER_DIRECTIVES",
        "OTHER_ATTR",
        "EVENTS",
        "CONTENT",
      ],
      'alphabetical': true,
    }],
  },
};
