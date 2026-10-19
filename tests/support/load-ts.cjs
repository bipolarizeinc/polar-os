/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} }; cache.set(file, loadedModule);
    const js = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const req = name => {
      if(name === 'server-only')return {};
      if(name in overrides)return overrides[name];
      if(name.startsWith('@/'))return load(name.replace('@/', './') + '.ts');
      if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name)+'.ts');
      return require(name);
    };
    vm.runInNewContext(js,{require:req,module:loadedModule,exports:loadedModule.exports,process,URL,URLSearchParams,fetch:overrides.fetch||fetch,AbortSignal,console},{filename:file});
    return loadedModule.exports;
  }
  return load;
}

module.exports = loader;
