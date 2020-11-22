module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/strongly-recommended', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'import/no-unresolved': [2, { caseSensitive: true }],
    'import/prefer-default-export': 'off',
    'arrow-parens': [2, 'as-needed'],
    'no-trailing-spaces': ['error', { skipBlankLines: true, ignoreComments: true }],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-new': 'off',
    'prefer-promise-reject-errors': 'off',
    'nonblock-statement-body-position': ['error', 'beside', { overrides: { if: 'any' } }],
    curly: ['error', 'multi-or-nest', 'consistent'],
    camelcase: 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        },
      },
    ],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea', 'div', 'span'],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-use-before-define': 'off',
    'max-len': [
      'error',
      {
        code: 130,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
  globals: {
    axios: true,
  },
};
