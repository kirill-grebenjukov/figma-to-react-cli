import uniq from 'lodash/uniq';
import keys from 'lodash/keys';

const regexp = /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/;

export function linesToMap(imports) {
  const map = {};

  imports.forEach(line => {
    if (!line) {
      return;
    }

    const m = line.match(regexp);

    if (!m || m.length < 2) {
      return;
    }

    let classes = m[1];
    if (classes.endsWith(' ')) {
      classes = classes.substr(0, classes.length - 1);
    }

    const lib = m[2];

    const old = map[lib] || {};
    if (classes.startsWith('* as ')) {
      map[lib] = { ...old, glob: classes };
      return;
    }

    const openIndex = classes.indexOf('{');
    if (openIndex >= 0) {
      const tokens = classes.split('{');
      const glob = tokens[0]
        .replace(',', '')
        .split(' ')
        .join('');
      const nonGlob = tokens[1]
        .replace('}', '')
        .split(' ')
        .join('')
        .split(',');

      map[lib] = {
        glob: glob || old.glob,
        nonGlob: uniq([...(old.nonGlob || []), ...nonGlob]),
      };
    } else {
      map[lib] = { ...old, glob: classes };
    }
  });

  return map;
}

export function mapToLines(map, eol) {
  return keys(map)
    .map(key => {
      const { glob, nonGlob } = map[key];

      const ng = nonGlob ? `{ ${nonGlob.join(', ')} }` : '';
      const g = glob ? `${glob}${ng ? ', ' : ''}` : '';

      return `import ${g}${ng} from '${key}';`;
    })
    .join(eol);
}

export default function normalizeImports(lines, eol) {
  return mapToLines(linesToMap(lines), eol);
}
