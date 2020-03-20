const get = require('lodash/get');

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const selector = 'CallExpression[callee.object.name="_"]';
    const sourceCode = context.getSourceCode();

    return {
      [selector](node) {
        const method = get(node, ['callee', 'property', 'name']);

        if (method !== 'map') {
          return;
        }
        const ancestors = context.getAncestors();

        const isFixed = ancestors.some((ancestor) => {
          if (ancestor.type !== 'IfStatement' && ancestor.type !== 'ConditionalExpression') {
            return false;
          }

          const condition = get(ancestor, ['test', 'type']);

          if (!condition) {
            return false;
          }

          const conditionSourceCode = sourceCode.getText(ancestor);

          return conditionSourceCode.toLowerCase().includes('isarray');
        });

        if (isFixed) {
          return;
        }

        const collection = get(node, 'arguments[0]');
        const callback = get(node, 'arguments[1]');

        if (!collection || !callback) {
          return;
        }

        if (collection.type === 'ObjectExpression') {
          return;
        }

        let replacement;

        const collectionSourceCode = sourceCode.getText(collection);
        const callbackSourceCode = sourceCode.getText(callback);
        const nodeSourceCode = sourceCode.getText(node);

        if (collection.type === 'ArrayExpression') {
          replacement = `${collectionSourceCode}.map(${callbackSourceCode})`;
        } else {
          replacement = `Array.isArray(${collectionSourceCode}) ?\n  ${collectionSourceCode}.map(${callbackSourceCode}) :\n  ${nodeSourceCode}`;
        }

        const fix = (fixer) => fixer.replaceText(node, replacement);

        context.report({
          message: 'use native Array.prototype.map',
          node,
          fix,
        });
      },
    };
  },
};
