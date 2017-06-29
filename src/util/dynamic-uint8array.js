/**
 * Created by coin on 04/01/2017.
 */

export const dynamic_uint8_array = (size) => {
  let length = size || 1 << 16
  let array = new Uint8Array(length)
  let point = 0
  let len, next
  
  const push = (...args) => {
    args.forEach(arr => {
      len = arr.length || arr.byteLength || 0
      if (point + len > length) {
        length = length * 2 + len
        next = new Uint8Array(length)
        next.set(array, 0)
        array = next
      }
      array.set(arr, point)
      point += len
    })
    return point
  }
  
  const get = () => {
    return array.slice(0, point)
  }
  
  return { push, get }
}