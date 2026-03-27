module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react-refresh'],

  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
  ],

  rules: {
    // ❌ Tắt hoàn toàn cảnh báo biến không dùng (dành cho đồ án)
    '@typescript-eslint/no-unused-vars': 'off',

    // ❌ Không yêu cầu import React trong TSX
    'react/react-in-jsx-scope': 'off',

    // ⚡ Giữ rule Vite Fast Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // ❌ Tắt yêu cầu kiểu return type
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // ❌ Cho phép dùng any tự do
    '@typescript-eslint/no-explicit-any': 'off',

    // ❌ Tắt yêu cầu định nghĩa trước khi dùng
    'no-use-before-define': 'off',

    // ❌ Cho phép console.log (để debug đồ án)
    'no-console': 'off',
  },
};
