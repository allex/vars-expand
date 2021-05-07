// Inspired from shell variable expansion, ref: [parameter_brace_expand](https://git.savannah.gnu.org/cgit/bash.git/tree/subst.c?h=devel#n8924)

interface StringTranspileResult {
  token: string;
  index: number;
}

interface Kv<T = any> {
  [k: string]: T
}

const rExpandVariable = /\$\{([^}]+)\}/g

export default function parameterBraceExpand (str: string, data: Kv): string {
  // reset reg cursor
  rExpandVariable.lastIndex = 0

  const sb = []
  const len = str.length
  let sindex = 0
  let match

  while (match = rExpandVariable.exec(str)) {
    sb.push(str.substring(sindex, match.index))
    sindex = match.index + match[0].length

    const temp = match[1]
    const { token, index } = stringExtract(temp, 0, ':-+')
    let envVal = ''

    if (token) {
      envVal = data[token]

      let tindex = index
      let c = temp[tindex]
      let ifsIsNull = envVal == null

      if (c === ':') {
        tindex += 1
        c = temp[tindex]
        ifsIsNull = ifsIsNull || envVal === ''
      }

      if (!'-+'.includes(c)) {
        throw new Error('Invalid expand variable expr')
      }

      switch (c) {
        case '+':
          if (!ifsIsNull) {
            envVal = temp.substring(tindex + 1)
          }
          break
        case '-':
          if (ifsIsNull) {
            envVal = temp.substring(tindex + 1)
          }
          break
        default:
          break
      }
    } else {
      envVal = data[temp]
    }

    if (envVal === undefined) {
      envVal = ''
    }
    sb.push(envVal)
  }

  if (sindex < len) {
    sb.push(str.substring(sindex, len))
  }

  return sb.join('')
}

function stringExtract (string: string, sindex: number, charlist: string): StringTranspileResult {
  let i = sindex
  let found = 0
  let c = ''
  while (c = string[i]) {
    if (c === '\\') {
      if (string[i + 1]) {
        i++
      } else {
        break
      }
    } else if (charlist.includes(c)) {
      found = 1
      break
    }
    i++
  }
  if (found === 0) {
    return {
      token: '',
      index: i
    }
  }
  return {
    token: string.substring(sindex, i),
    index: i
  }
}
