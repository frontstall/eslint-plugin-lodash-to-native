const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/map');

const tester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

tester.run('map', rule, {
  valid: [
    {
      code: 'const x = _.map()',
    },
    {
      code: 'const x = _.map(array)',
    },
    {
      code: 'const x = map(array, cb)',
    },
    {
      code: 'const x = Array.isArray(array) ? array.map(cb) : _.map(array, cb);',
    },
    {
      code: 'if (Array.isArray(array)) { x = array.map(cb); } else { x = _.map(array, cb); }',
    },
    {
      code: 'function foo ()  { return _.sap(array, cb); }',
    },
    {
      code: 'const x = _.map({ a: 1 }, cb)',
    },
  ],
  invalid: [
    {
      code: 'const x = _.map(array, cb)',
      errors: [{ message: 'Use build-in Array.prototype.map' }],
    },
    {
      code: 'function foo () { _.map(array, cb); }',
      errors: [{ message: 'Use build-in Array.prototype.map' }],
    },
    {
      code: 'if (a > b) { x = array.map(cb); } else { x = _.map(array, cb); }',
      errors: [{ message: 'Use build-in Array.prototype.map' }],
    },
    {
      code: 'const x = _.map([{ a: 1 }], cb)',
      errors: [{ message: 'Use build-in Array.prototype.map' }],
    },
  ],
});
