# vars-expand

A shell-like vars expand template transpiler, Inspired from [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)

## Install

```sh
yarn install vars-expand
```

# Usage

```js
import varsBraceExpand from 'vars-expand'

const data = {
  JAEGER_UI_BASE: "http://127.0.0.1:3000",
  EMPTY_VAR: "",
};
const s = `{
  x1: '\${JAEGER_UI_BASE:-http://127.0.0.1:3001}',
  x2: '\${JAEGER_UI_BASE-http://127.0.0.1:3002}',
  a1: '\${JAEGER_UI_BASE:+http://127.0.0.1:3003}',
  a2: '\${JAEGER_UI_BASE+http://127.0.0.1:3004}',
  b1: '\${UNDEFINED:-/bin}',
  b2: '\${UNDEFINED-/bin}',
  c1: '\${UNDEFINED:+/bin}',
  c2: '\${UNDEFINED+/bin}',
  d1: '\${EMPTY_VAR:-allex}',
  d2: '\${EMPTY_VAR-allex}',
  e1: '\${EMPTY_VAR:+allex}',
  e2: '\${EMPTY_VAR+allex}',
}`;

const obj = varsBraceExpand(s, data);
expect(obj).toMatchInlineSnapshot(`
  "{
    x1: 'http://127.0.0.1:3000',
    x2: 'http://127.0.0.1:3000',
    a1: 'http://127.0.0.1:3003',
    a2: 'http://127.0.0.1:3004',
    b1: '/bin',
    b2: '/bin',
    c1: '',
    c2: '',
    d1: 'allex',
    d2: '',
    e1: '',
    e2: 'allex',
  }"
`);
```

## Notes

Please request features or report problems using the [issues](https://github.com/allex/vars-expand/issues) page.

## License

See the included [LICENSE](LICENSE) for rights and limitations under the terms of the MIT license.
