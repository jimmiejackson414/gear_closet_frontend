module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
  ],
  plugins: [
    'stylelint-scss',
  ],
  rules: {
    indentation: [2,
      {
        baseIndentLevel: 1,
      },
    ],
    'color-function-notation': null,
    'scss/no-global-function-names': null,
    'at-rule-no-unknown': [true,
      {
        ignoreAtRules: ['extend', 'for'],
      },
    ],
  },
};
