module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-inline-styles': 'off',
        eqeqeq: 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        radix: 'off',
      },
    },
  ],
};
