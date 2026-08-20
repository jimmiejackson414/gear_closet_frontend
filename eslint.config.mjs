// @ts-check
import stylistic from '@stylistic/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    ignores: [
      '**/node_modules/**',
      '**/generated/**',
      '**/dist/**',
      '**/*.html',
      // Local Supabase CLI temp / bundled edge runtime (minified)
      'supabase/.temp/**',
    ],
  },
  {
    plugins: {
      '@stylistic': stylistic,
      perfectionist,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      curly: 'off',
      'object-shorthand': ['warn', 'always'],
      'no-duplicate-imports': 'warn',

      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 0,
          customGroups: [
            { groupName: 'vue', elementNamePattern: '^vue' },
            { groupName: 'nuxt-components', elementNamePattern: '^#components' },
            { groupName: 'supabase-server', elementNamePattern: '^#supabase' },
          ],
          groups: [
            'builtin',
            'vue',
            'external',
            'nuxt-components',
            'supabase-server',
            'internal',
            ['parent', 'sibling', 'index'],
            ['type-external', 'type-internal', 'type-parent', 'type-sibling', 'type-index'],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-exports': 'warn',

      // Match prior @stylistic/js rules that aren't covered by Nuxt stylistic defaults
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/indent': ['warn', 2, { SwitchCase: 1, MemberExpression: 1 }],
      '@stylistic/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 1 }],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/space-before-function-paren': ['warn', 'always'],

      // Soften Nuxt/TS recommended rules that were not hard failures before
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'import/first': 'off',

      // Vue-specific tweaks carried from .eslintrc.cjs
      'vue/object-curly-spacing': ['warn', 'always'],
      'vue/component-name-in-template-casing': ['warn', 'kebab-case', { registeredComponentsOnly: false }],
      'vue/no-v-html': 'off',
      // Vue 3 allows multi-root templates (e.g. page + scroll-to-top)
      'vue/no-multiple-template-root': 'off',
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
      'vue/padding-line-between-blocks': ['warn', 'always'],
      'vue/first-attribute-linebreak': [
        'warn',
        {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/component-api-style': ['warn', ['script-setup']],
      'vue/attributes-order': ['warn', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      }],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      // vue/script-indent (baseIndent: 1) owns <script> indentation; stylistic indent fights it.
      '@stylistic/indent': 'off',
    },
  },
  {
    files: ['pages/**/*.vue', 'components/ui/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
);
