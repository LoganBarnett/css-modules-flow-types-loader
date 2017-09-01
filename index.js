'use strict';

import fs from 'fs';
import printFlowDefinition from 'css-modules-flow-types-printer';
import Tokenizer from 'css-selector-tokenizer';

// function getTokens(content) {
//   const cssTokens = content.replace(/\s/g, '').match('exports.locals=(.*);');
//   if (cssTokens) {
//     return JSON.parse(cssTokens[1]);
//   }
//   return {};
// }

const getAllClassNames = (tokens) => {
  const names = tokens.nodes.reduce((acc, node) => {
    if(node.type == 'selector') {
      const names = getAllClassNames(node)
            .filter(n => n.type == 'class')
      return acc.concat(names)
    }
    else if(node.type == 'class'){
      acc.push(node)
    }
    return acc
  },[])
  return names
}

const toNamesObj = (nodes) => {
  const namesObj = {}
  nodes.forEach(n => namesObj[n.name] = '')
  return namesObj
}

module.exports = function cssModulesFlowTypesLoader(content) {
  // NOTE: We cannot use .emitFile as people might use this with devServer
  // (e.g. in memory storage).
  const outputPath = this.resourcePath + '.flow';
  const cssContents = fs.readFileSync(this.resourcePath, 'utf8')
  const nodes = getAllClassNames(Tokenizer.parse(cssContents))
  const output = printFlowDefinition(toNamesObj(nodes)) 
  fs.writeFile(outputPath, output, {}, function() {});

  return content;
};
