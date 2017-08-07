/**
 * Created by coin on 05/01/2017.
 */

export const FILE_ORIGIN = {
  utf8: 0
}

export const SEPARATOR = {
  Tab: 0x09,          // '  '
  Semicolon: 0x3b,    // ';'
  Comma: 0x2c,        // ','
  Space: 0x20         // ' '
}

export const QUOTATION = {
  SingleQuotation: 0x27,  // "'"
  DoubleQuotation: 0x22   // '"'
}

export class CSVParser {

  /**
   * @param {Number} [separator] separated of content
   * @param {Number} [quotation] mark of content quotes
   */
  constructor (separator, quotation) {
    this.separator = separator || SEPARATOR.Comma
    this.quotation = quotation || QUOTATION.DoubleQuotation
  }

  /**
   * 解析csv单行,以`,`作为分隔判断,支持 `a, "b,c", d` 这样的格式
   * @param {Uint8Array} array
   * @return {Array<Uint8Array>}
   *
   * @example
   * ```JavaScript
   * parse([110,97,109,101,45,48,44,110,97,109,101,45,49])
   * // output
   * [
   *   [110,97,109,101,45,48],
   *   [110,97,109,101,45,49]
   * ]
   * ```
   */
  parse (array) {
    const separator = this.separator
    const quotation = this.quotation
    const length = array.byteLength
    const last = length - 1
    const result = []
    let point = 0, next, code, start, end, counter = 0

    while (point < length) {
      code = array[point]

      // `a,"first,second",b` => ["a", "first,second", "b]
      if (code === quotation) {
        start = point + 1
        end = array.indexOf(quotation, start)

        // 格式错误
        if (end === -1) {
          throw new Error(`Parse Error at: ${String.fromCharCode.apply(null, result[counter - 1])}`)
        }

        next = end + 2

      } else if (code === separator) {
        // ,,, => ['','','','',]
        start = end = point
        next = point + 1
      } else {
        // first,second => ["first", "second"]
        start = point
        end = array.indexOf(separator, start)

        // 最后没有分隔符，直接截取到最后位置
        if (end === -1) {
          end = length
        }

        next = end + 1
      }

      result[counter++] = array.slice(start, end)
      point = next
    }

    // 如果最后个字符是分隔符，添加一个空字符
    if (array[last] === separator) {
      result[counter] = array.slice(0, 0)
    }

    return result
  }
}

