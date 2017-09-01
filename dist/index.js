'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cssModulesFlowTypesPrinter = require('css-modules-flow-types-printer');

var _cssModulesFlowTypesPrinter2 = _interopRequireDefault(_cssModulesFlowTypesPrinter);

var _cssSelectorTokenizer = require('css-selector-tokenizer');

var _cssSelectorTokenizer2 = _interopRequireDefault(_cssSelectorTokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function getTokens(content) {
//   const cssTokens = content.replace(/\s/g, '').match('exports.locals=(.*);');
//   if (cssTokens) {
//     return JSON.parse(cssTokens[1]);
//   }
//   return {};
// }

const getAllClassNames = tokens => {
  const names = tokens.nodes.reduce((acc, node) => {
    if (node.type == 'selector') {
      const names = getAllClassNames(node).filter(n => n.type == 'class');
      return acc.concat(names);
    } else if (node.type == 'class') {
      acc.push(node);
    }
    return acc;
  }, []);
  return names;
};

const toNamesObj = nodes => {
  const namesObj = {};
  nodes.forEach(n => namesObj[n.name] = '');
  return namesObj;
};

module.exports = function cssModulesFlowTypesLoader(content) {
  // NOTE: We cannot use .emitFile as people might use this with devServer
  // (e.g. in memory storage).
  const outputPath = this.resourcePath + '.flow';
  const cssContents = _fs2.default.readFileSync(this.resourcePath, 'utf8');
  const nodes = getAllClassNames(_cssSelectorTokenizer2.default.parse(cssContents));
  const output = (0, _cssModulesFlowTypesPrinter2.default)(toNamesObj(nodes));
  _fs2.default.writeFile(outputPath, output, {}, function () {});

  return content;
};