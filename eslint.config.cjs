  const js = require('@eslint/js');
  const jest = require('eslint-plugin-jest');

  module.exports = [
    js.configs.recommended,
    jest.configs['flat/recommended'],
    {
      files: ['**/*.js'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
        globals: {
          console: 'readonly',
          require: 'readonly',
          module: 'readonly',
          describe: 'readonly',
          test: 'readonly',
          expect: 'readonly',
          beforeEach: 'readonly'
        }
      },
      plugins: {
        jest
      },
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-conditional-expect': 'error',
        'jest/no-identical-title': 'error'
      }
    }
  ];