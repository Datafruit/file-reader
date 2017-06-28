/**
 * Created by asd on 17-6-27.
 * @file 检测csv的行的完整性
 * a,b,"c\nd\ne", f
 * 如上，csv中的字段有可能包含\n这样的字符，
 * 此时需要将多行作为一行，才能解析出正确的结果
 */

const DefOpt = {
  separator: 0x2c,   // ','
  quotation: 0x22,   // '"'
  lf: 0xA            // \n
}

/**
 * 连接两个ArrayBuffer
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @return {Uint8Array}
 */
function concat (a, b) {
  const al = a.byteLength
  if (al === 0) return b
  const bl = b.byteLength
  const len = al + bl + 1
  const buf = new Uint8Array(len)

  buf.set(a, 0)
  buf.set(new Uint8Array([DefOpt.lf]), al)
  buf.set(b, al + 1)
  return buf
}

class CsvCompleteLine {
  /**
   * @param {Number} quotation
   * @param {Number} separator
   * @constructor
   */
  constructor (quotation, separator) {
    this.quotation = quotation === void 0 ? DefOpt.quotation : quotation
    this.separator = separator === void 0 ? DefOpt.separator : separator
    this.cache = new Uint8Array(0)
  }

  /**
   * 如果 line 是一个完整的csv行，返回line，
   * 否则返回空的Uint8Array
   * @param {Uint8Array} line
   * @return {Uint8Array}
   */
  press (line) {
    const { quotation } = this
    const buf = concat(this.cache, line)

    // 如果没有引用的字段，直接返回
    let start = buf.indexOf(quotation)
    if (start < 0) return buf

    // 检测引用字符是否是成对的出现
    let count = 1

    while (start > -1) {
      start = buf.indexOf(quotation, start + 1)
      if (start > -1) count++
    }

    // 成对出现
    if (count % 2 === 0) {
      this.cache = new Uint8Array(0)
      return buf
    }

    // 未成对出现，缓存着
    this.cache = buf

    return new Uint8Array(0)
  }

}

export { CsvCompleteLine, DefOpt }
