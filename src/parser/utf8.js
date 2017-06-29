/**
 * Created by coin on 21/12/2016.
 */

import { UCS2Parser } from './ucs2'
import { dynamic_uint8_array } from '../util/dynamic-uint8array'

const BYTE_RANGE = {
  1: [0x0000, 0x007F],
  2: [0x0080, 0x07FF],
  3: [0x0800, 0xFFFF],
  4: [0x10000, 0x1FFFFF],
  5: [0x200000, 0x3FFFFFF],
  6: [0x4000000, 0x7FFFFFFF]
}

const BYTES_AND_BASE = [
  0,                               // 0000000000
  1,                               // 0b00000001
  3,                               // 0b00000011
  7,                               // 0b00000111
  15,                              // 0b00001111
  31,                              // 0b00011111
  63,                              // 0b00111111
  127,                             // 0b01111111
  255                              // 0b11111111
]

/**
 * 解析utf8编码文件,以免切片时将同字符的不同字节拆分到不同的片上
 */
export class UTF8Parser {

  constructor () {
    this.prev_buffer = null
    this.bytes = 0
    this.utf8_bom = [0x00ef, 0x00bb, 0x00bf]
    this.parser = new UCS2Parser()
  }

  /**
   * @param {Uint8Array} arr
   * @return {{character: Array, byteLength: number}}
   */
  parse (arr) {
    const length = arr.byteLength
    const get_point = UTF8Parser.get_point
    const character = []
    let character_count = 0
    let byteLength = 0

    let point = 0
    let end_increment = 1
    let cur, bytes, byte_start, byte_end, bytes_count

    while (point < length) {
      cur = arr[point]

      // 在utf8中
      // 127(0b01111111) ~ 160(0b10100000) 全是空的
      // 所以如果出现这样的字符,理论上应该抛出错误
      // 但是为了速度起见,忽略错误检查

      // 128 === 0b10000000
      if (cur < 128) {
        end_increment = 1
      }
      // 192 === 0b11000000
      else if (cur < 192) {
        end_increment = 1
      }
      // 224 === 0b11100000
      else if (cur < 224) {
        end_increment = 2
      }
      // 240 === 0b11110000
      else if (cur < 240) {
        end_increment = 3
      }
      // 248 === 0b11111000
      else if (cur < 248) {
        end_increment = 4
      }
      // 252 === 0b11111100
      else if (cur < 252) {
        end_increment = 5
      }

      byte_start = point
      byte_end = point + end_increment

      if (byte_end > length) {
        break
      }

      if (end_increment === 1) {
        character[character_count++] = cur
        byteLength += 1
      } else {
        bytes = []
        bytes_count = 0

        while (byte_start < byte_end) {
          bytes[bytes_count++] = arr[byte_start++]
        }

        character[character_count++] = get_point(bytes, bytes_count)
        byteLength += bytes_count
      }
      point = byte_end
    }

    this.prev_buffer = point === length ? null : arr.slice(point)
    this.bytes = this.bytes + length
    return { character, byteLength }
  }

  /**
   *
   * @param {Uint8Array} buf
   * @return {*}
   */
  entry (buf) {
    let arr
    const { prev_buffer } = this

    if (prev_buffer !== null) {
      const prev_len = prev_buffer.byteLength
      const buf_len = buf.byteLength
      const cur = new Uint8Array(buf)
      const buffer = new ArrayBuffer(prev_len + buf_len)

      arr = new Uint8Array(buffer)
      arr.set(prev_buffer, 0)
      arr.set(cur, prev_len)

      this.prev_buffer = null

    } else {
      arr = new Uint8Array(buf)
    }

    // 剔除BOM
    // utf8的BOM为 [0x00ef, 0x00bb, 0x00bf]
    // 只出现在文档最前
    const utf8_bom = this.utf8_bom
    const len_bom = utf8_bom.length

    if (this.bytes < len_bom) {
      const result = this.filterOutBOM(arr)
      arr = result.array
      this.bytes = result.point
    }

    return arr.byteLength > 0 ? this.parse(arr) : this
  }

  /**
   * @param {Uint8Array} buf
   * @return {{point: number, array: Uint8Array}}
   */
  filterOutBOM (buf) {
    // 剔除BOM
    // utf8的BOM为 [0x00ef, 0x00bb, 0x00bf]
    // 只出现在文档最前
    const utf8_bom = this.utf8_bom
    const len_bom = utf8_bom.length
    const length = buf.byteLength

    let start = this.bytes
    let index = 0

    if (start < len_bom) {
      while (start < len_bom && index < length) {
        if (buf[index] === utf8_bom[start]) {
          index++
          start++
        } else {
          break
        }
      }
      buf = buf.slice(index)
    }

    return {
      point: start,
      array: buf
    }
  }

  done () {
    return this.prev_buffer === null
  }

  /**
   * @static
   * @param bytes
   * @param len - bytes.length
   * @returns {Number}
   */
  static get_point (bytes, len) {

    const First = bytes[0]
    const Remain = bytes.slice(1)
    const Remain_len = len - 1
    const Base = BYTES_AND_BASE[6]

    // 保留后 (8 - len) 位
    let code_point = (First & BYTES_AND_BASE[8 - len]) << (Remain_len * 6)

    // 后面的保留后6位
    for (let i = 0; i < Remain_len; i++) {
      code_point = code_point + ((Remain[i] & Base) << (Remain_len - i - 1) * 6)
    }

    return code_point
  }

  /**
   * unicode => utf8
   * @static
   * @param {Array<number>} array
   * @return {Uint8Array}
   */
  static unicode_to_utf8_uint8 (array) {
    const length = array.length
    const result = dynamic_uint8_array(length * 2)

    let code, point = 0

    // 192 => 0b11000000
    // 128 => 0b10000000
    // 63 => 0b111111
    // 224 => 0b11100000
    // 240 => 0b11110000
    // 248 => 0b11111000

    while (point < length) {
      code = array[point++]
      // 1 byte
      if (code < 0x0080) {
        result.push([code])
      }
      // 2 byte, 16 bit
      else if (code < 0x0800) {
        result.push([
          192 | (code >> 6),
          128 | (code & 63)
        ])
      }
      // 3 byte
      else if (code < 0x10000) {
        result.push([
          224 | (code >> 12),
          128 | ((code >> 6) & 63),
          128 | (code & 63)
        ])
      }
      // 4 byte
      else if (code < 0x200000) {
        result.push([
          240 | (code >> 18),
          128 | ((code >> 12) & 63),
          128 | ((code >> 6) & 63),
          128 | (code & 63)
        ])
      }
      // 5 byte
      else if (code < 0x4000000) {
        result.push([
          248 | (code >> 24),
          128 | ((code >> 18) & 63),
          128 | ((code >> 12) & 63),
          128 | ((code >> 6) & 63),
          128 | (code & 63)
        ])
      }
    }

    return result.get()
  }

  /**
   * @static
   * @param {String} string
   * @return {Uint8Array}
   */
  static string_to_utf8_uint8 (string) {
    return UTF8Parser.unicode_to_utf8_uint8(UCS2Parser.decode(string))
  }
}