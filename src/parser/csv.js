/**
 * Created by coin on 05/01/2017.
 */

import { ContentFormat } from '../exceptions'

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
   * @param {number} [separator] separated of content
   * @param {number} [quotation] mark of content quotes
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
   * parse_line([110,97,109,101,45,48,44,110,97,109,101,45,49])
   * // output
   * [
   *   [110,97,109,101,45,48],
   *   [110,97,109,101,45,49]
   * ]
   * ```
   */
  parse_line (array) {
    const separator = this.separator
    const quotation = this.quotation
    const length = array.byteLength
    const result = []
    let point = 0, next, code, start, end
    
    while (point < length) {
      code = array[point]
      next = point + 1
      
      // `a,"first,second",b` => ["a", "first,second", "b]
      if (code === quotation) {
        start = next
        end = array.indexOf(quotation, next)
        
        if (end === -1) {
          throw new ContentFormat(
            '数据格式错误: '
            + String.fromCodePoint.apply(String, array)
          )
        }
        
        next = end + 2
      }
      
      // ,,, => ['','','',]
      else if (code === separator) {
        start = end = point
        next = end + 1
      }
      // first,second => ["first", "second"]
      else {
        start = point
        end = array.indexOf(separator, next)
        if (end === -1) {
          end = length
        }
        next = end + 1
      }
      
      result.push(array.slice(start, end))
      point = next
    }
    
    if (code === separator) {
      result.push(new Uint8Array(0))
    }
    
    return result
  }
}