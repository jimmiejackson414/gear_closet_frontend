/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  'extends': [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
  ],
  overrides: [
    {
      files: ['./pages/**/*.vue', './components/ui/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      excludedFiles: '*.vue',
      files: ['**/*.js', '**/*.ts'],
      rules: {
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/linebreak-style': ['error', 'unix'],
      },
    },
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
  },

  plugins: ['@kalimahapps/eslint-plugin-tailwind', '@stylistic/js', 'no-relative-import-paths', 'perfectionist'],

  root: true,

  rules: {
    '@kalimahapps/tailwind/sort': 'off',
    '@stylistic/js/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/js/indent': 'off',
    '@stylistic/js/linebreak-style': 'off',
    '@stylistic/js/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 1 }],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/semi': ['warn', 'always'],
    '@stylistic/js/space-before-function-paren': ['warn', 'always'],
    curly: ['off', 'multi'],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { 'allowSameFolder': true, 'prefix': '@' },
    ],
    'object-shorthand': ['warn', 'always'],
    'perfectionist/sort-enums': ['warn', { type: 'natural' }],
    'perfectionist/sort-exports': 'warn',
    'perfectionist/sort-imports': [
      'warn',
      {
        customGroups: {
          value: {
            'nuxt-components': '^#components', // Matches Nuxt auto-imported components
            'supabase-server': '^#supabase',
            'vue': '^vue',
          },
        },
        groups: [
          'builtin',
          'vue',
          'external', // Built-in Node modules & third-party packages
          'nuxt-components', // Nuxt auto-imported components (`#components`)
          'supabase-server',
          'internal', // Internal project imports (e.g., @/utils, @/types)
          ['parent', 'sibling', 'index'], // Relative imports
          'object',
          ['external-type', 'internal-type', 'parent-type', 'sibling-type', 'index-type'],
          'unknown',
        ],
        internalPattern: ['^@/', '^~/'],
        newlinesBetween: 'never',
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-interfaces': ['warn'],
    'perfectionist/sort-named-imports': 'warn',
    'perfectionist/sort-object-types': 'warn',
    'perfectionist/sort-objects': ['warn', {
      type: 'alphabetical',
    }],
    'perfectionist/sort-union-types': [
      'warn',
      {
        groups: [
          'named', // Named types (e.g., `ProfileApiResponse`)
          'keyword', // Primitive types (e.g., `string`, `number`, `boolean`)
          'operator', // Complex types (e.g., `Array<T>`, `Record<K, V>`)
          'literal', // Literal types (e.g., `'foo' | 42`)
          'nullish', // `null | undefined` (always last)
        ],
        order: 'asc',
        type: 'natural',
      },
    ],

    'vue/attributes-order': ['warn', {
      'alphabetical': true,
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
    }],
    'vue/block-order': [
      'warn',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/component-api-style': ['warn', ['script-setup']],
    'vue/component-name-in-template-casing': ['warn', 'kebab-case', { registeredComponentsOnly: false }],
    'vue/first-attribute-linebreak': [
      'warn',
      {
        multiline: 'below',
        singleline: 'beside',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        multiline: 'never',
        singleline: 'never',
      },
    ],
    'vue/html-closing-bracket-spacing': [
      'warn',
      {
        selfClosingTag: 'always',
      },
    ],
    'vue/html-indent': ['error'],
    'vue/no-v-html': 'off',
    // Vue specific tweaks
    'vue/object-curly-spacing': ['warn', 'always'],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/script-indent': [
      'warn',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
  },

  // settings: {

  // },
};
