/**
 * @fileoverview replaces lodash methods with native ones if possible
 * @author Roman Makarov
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// eslint-disable-next-line import/no-unresolved
const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);
