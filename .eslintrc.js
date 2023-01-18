module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:cypress/recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    '@vue/typescript/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['node_modules', 'dist', 'generated', '*.js'],
  plugins: ['cypress'],
  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },
  reportUnusedDisableDirectives: true,
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'cypress',
      ],
      peerDependencies: true,
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never',
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowTypedFunctionExpressions: true }],
    'arrow-parens': 'off',
    'import/prefer-default-export': 'off',
    indent: 'off',
    'linebreak-style': 'off',
    'max-len': 'off',
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 1 }],
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'object-shorthand': ['error', 'always'],
    semi: [2, 'always'],
    'space-before-function-paren': ['error', 'always'],

    // Vue specific tweaks
    'vue/max-len': 'off',
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/max-attributes-per-line': [
      1,
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vuejs-accessibility/no-autofocus': 'off',
    'vue/no-v-text-v-html-on-component': 'off',

    // Cypress specific tweaks
    'cypress/no-unnecessary-waiting': 'off',
  },
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        indent: 'off',
        '@typescript-eslint/indent': 'off',
      },
    },
  ],
};
