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

  plugins: ['@kalimahapps/eslint-plugin-tailwind', '@stylistic/js', 'import', 'no-relative-import-paths'],

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
    'object-shorthand': ['warn', 'always'],
    'import/no-duplicates': 'warn',
    'sort-imports': [1, { ignoreDeclarationSort: true }],
    'import/order': [
      'warn',
      {
        pathGroupsExcludedImportTypes: ['type'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@stylistic/js/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/js/indent': 'off',
    '@stylistic/js/linebreak-style': 'off',
    '@stylistic/js/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 1 }],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/semi': ['warn', 'always'],
    '@stylistic/js/space-before-function-paren': ['warn', 'always'],
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { 'allowSameFolder': true, 'prefix': '@' },
    ],

    // Vue specific tweaks
    'vue/object-curly-spacing': ['warn', 'always'],
    'vue/component-name-in-template-casing': ['warn', 'kebab-case'],
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-spacing': [
      'warn',
      {
        selfClosingTag: 'always',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/html-indent': ['error'],
    'vue/script-indent': [
      'warn',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
    'vue/block-order': [
      'warn',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/first-attribute-linebreak': [
      'warn',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/component-api-style': ['warn', ['script-setup']],
    'vue/attributes-order': ['warn', {
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
