import fs from 'fs';
import vm from 'vm';
import m from 'module';

export default function getConfig(configPath) {
  const content = configPath
    ? fs.readFileSync(configPath, { encoding: 'utf8' })
    : null;

  let options = null;
  if (content) {
    if (configPath.endsWith('.js')) {
      vm.runInThisContext(m.wrap(content))(
        exports,
        require,
        module,
        __filename,
        __dirname,
      );

      options = module.exports;
    } else {
      options = JSON.parse(content);
    }
  }

  return options;
}
