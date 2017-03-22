/**
 * Created by coin on 05/01/2017.
 */

import { random } from '../../../src/util/util'
const ECODEING = {
  ASCII: [0, 128],
  UNICODE: [0, 0xFFFF]
}
const LENGTH = 6
const STRING_KEY_ARRAY = new Array(LENGTH).fill(1)

const toString = (array) => {
  return String.fromCodePoint.apply(String, array)
}

const getString = (range) => {
  const min = range[0], max = range[1]
  const code_points = []
  let code
  
  const string = toString(STRING_KEY_ARRAY.map(() => {
    code = random(min, max)
    code_points.push(code)
    return code
  }))
  
  return { string, code_points }
}

const typeArrayToArray = (array) => array.reduce((p, c) => p.concat(c), [])

export { getString, ECODEING, toString, typeArrayToArray }