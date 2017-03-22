/**
 * Created by coin on 05/01/2017.
 */

/**
 * TODO 改写为Uint8Array实现
 */

const stringFromCharCode = String.fromCharCode
export class UCS2Parer {
  static decode (str) {
    const output = []
    let counter = 0
    const length = str.length
    let value
    let extra
    while (counter < length) {
      value = str.charCodeAt(counter++)
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = str.charCodeAt(counter++)
        if ((extra & 0xFC00) == 0xDC00) { // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000)
        } else {
          // unmatched surrogate only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value)
          counter--
        }
      } else {
        output.push(value)
      }
    }
    return output
  }
  
  static encode (array) {
    const length = array.length
    let index = -1
    let value
    let output = ''
    while (++index < length) {
      value = array[index]
      if (value > 0xFFFF) {
        value -= 0x10000
        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800)
        value = 0xDC00 | value & 0x3FF
      }
      output += stringFromCharCode(value)
    }
    return output
  }
}