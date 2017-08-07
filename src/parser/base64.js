/**
 * Created by coin on 03/01/2017.
 * https://zh.wikipedia.org/wiki/Base64
 */

export class Base64Parser {
  constructor () {
    this.code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  }

  /**
   * @param {Uint8Array} buffer
   * @return {String}
   */
  encode (buffer) {
    const len = buffer.byteLength
    const padding = len % 3
    const end = len - padding
    const code = this.code
    const result = []

    let buf = 0
    let point = 0
    let f, s, t

    while (point < end) {
      // 24 bit
      f = buffer[point++] << 16
      s = buffer[point++] << 8
      t = buffer[point++]

      buf = f + s + t

      // 6 bit
      // 0x3F === 0b111111
      result.push(
        code[buf >> 18 & 0x3F],
        code[buf >> 12 & 0x3F],
        code[buf >> 6 & 0x3F],
        code[buf & 0x3F]
      )

      buf = 0
    }

    if (padding === 2) {
      // 16 bit
      f = buffer[point++] << 8
      s = buffer[point]

      buf = f + s
      result.push(
        code[buf >> 10 & 0x3F],
        code[buf >> 4 & 0x3F],
        code[buf << 2 & 0x3F],
        '='
      )
    }

    if (padding === 1) {
      // 8 bit
      buf = buffer[point]
      result.push(code[buf >> 2], code[buf << 4 & 0x3F], '==')
    }

    return result.join('')
  }
}