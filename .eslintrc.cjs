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

  plugins: ['@kalimahapps/eslint-plugin-tailwind', '@stylistic/js', 'import', 'no-relative-import-paths', 'perfectionist'],

  root: true,

  rules: {
    '@kalimahapps/tailwind/sort': 'warn',
    '@stylistic/js/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/js/indent': 'off',
    '@stylistic/js/linebreak-style': 'off',
    '@stylistic/js/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 1 }],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/semi': ['warn', 'always'],
    '@stylistic/js/space-before-function-paren': ['warn', 'always'],
    curly: ['off', 'multi'],
    'import/no-duplicates': 'warn',
    'import/order': [
      'warn',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['type'],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { 'allowSameFolder': true, 'prefix': '@' },
    ],
    'object-shorthand': ['warn', 'always'],
    'perfectionist/sort-imports': 'off',
    'perfectionist/sort-interfaces': ['error'],
    'perfectionist/sort-objects': ['error', {
      type: 'alphabetical',
    }],
    'sort-imports': [1, { ignoreDeclarationSort: true }],

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
