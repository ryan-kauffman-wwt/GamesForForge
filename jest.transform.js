/**
 * A minimal custom Jest transform that converts ES module import/export
 * syntax to CommonJS so Jest (v26) can run the tests without Babel preset-env.
 */

const path = require('path');

module.exports = {
  process(sourceText, sourcePath) {
    // Convert named imports: import { a, b } from 'module'
    let code = sourceText
      .replace(
        /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
        'const $1 = require("$2")'
      )
      .replace(
        /import\s+(\w+)\s*,\s*\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g,
        (_, def, named, mod) => {
          const namedTrimmed = named.trim();
          return `const _m_${def} = require("${mod}"); const ${def} = _m_${def}.default || _m_${def}; const { ${namedTrimmed} } = _m_${def};`;
        }
      )
      .replace(
        /import\s+\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g,
        (_, names, mod) => `const { ${names.trim()} } = require("${mod}")`
      )
      .replace(
        /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
        (_, name, mod) => `const _m_${name} = require("${mod}"); const ${name} = _m_${name}.default !== undefined ? _m_${name}.default : _m_${name};`
      )
      // Remove bare imports (side-effect only)
      .replace(
        /import\s+['"]([^'"]+)['"]\s*;?/g,
        (_, mod) => `require("${mod}");`
      );

    // Convert export declarations
    code = code
      // export default function/class
      .replace(
        /export\s+default\s+(function|class)\s+(\w+)/g,
        '$1 $2'
      )
      // export default expression
      .replace(
        /export\s+default\s+/g,
        'module.exports.default = module.exports = '
      )
      // export const/let/var/function/class name = ...
      .replace(
        /export\s+(const|let|var|function|class)\s+(\w+)/g,
        (_, keyword, name) => {
          if (keyword === 'function' || keyword === 'class') {
            return `${keyword} ${name}`;
          }
          return `${keyword} ${name}`;
        }
      )
      // export { a, b, c }
      .replace(
        /export\s+\{([^}]*)\}\s*;?/g,
        (_, names) => {
          return names.split(',').map(n => {
            const trimmed = n.trim();
            if (!trimmed) return '';
            const [local, exported] = trimmed.split(/\s+as\s+/).map(s => s.trim());
            return `Object.defineProperty(exports, "${exported || local}", { get: function() { return ${local}; }, enumerable: true });`;
          }).join('\n');
        }
      );

    // Handle export const/let/var with assignment — add exports assignment after
    code = code.replace(
      /^(const|let|var)\s+(\w+)\s*=/gm,
      (match, keyword, name) => {
        // We'll handle exports separately via a post-processing step
        return match;
      }
    );

    // For exported functions/classes, add exports line after declaration
    // Re-process export function/class to also add to exports
    const exportedNames = [];
    sourceText.replace(
      /export\s+(?:default\s+)?(?:const|let|var|function|class)\s+(\w+)/g,
      (_, name) => { exportedNames.push(name); }
    );
    if (exportedNames.length > 0) {
      code += '\n// auto-generated exports\n';
      exportedNames.forEach(name => {
        code += `if (typeof ${name} !== 'undefined') { exports.${name} = ${name}; }\n`;
      });
    }

    return { code };
  },
};
