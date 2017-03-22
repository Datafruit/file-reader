/**
 * Created by coin on 18/12/2016.
 */

const str = 'abcdefghijklmnopqrstuvwxyz'
const str_len = str.length
const MAX_NUMBER = 1 << 30

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const random_str = (total) => {
  const list = []
  let i = 0
  let cur
  
  for (; i < total; i++) {
    cur = str[random(0, str_len)]
    list[i] = random(0, 10) > 5 ? cur.toUpperCase() : cur
  }
  
  return list.join('')
}

const gen_short_id = (pre_fix_len) => {
  pre_fix_len = pre_fix_len || 16
  let pre_fix = random_str(pre_fix_len)
  let count = 0
  return () => {
    if (count > MAX_NUMBER) {
      pre_fix = random_str(pre_fix_len)
      count = 0
    }
    return `${pre_fix}_${count++}`
  }
}

const short_id = gen_short_id()
const toString = Object.prototype.toString
const FunctionPrimitive = '[object Function]'
const ObjectPrimitive = '[object Object]'

const isFunction = (any) => toString.call(any) === FunctionPrimitive
const isObject = (any) => toString.call(any) === ObjectPrimitive

const identify = (v) => v

const noop = () => {}

const inherits = function (child, parent) {
  function __ () { this.constructor = child; }
  
  __.prototype = parent.prototype;
  child.prototype = new __();
}

const arrayLikeToArray = (arrayLike) => Array.prototype.slice.call(arrayLike)
const typeArrayToArray = (array) => array.reduce((p, c) => p.concat(c), [])

export {
  random,
  short_id,
  gen_short_id,
  isFunction,
  isObject,
  identify,
  noop,
  inherits,
  arrayLikeToArray,
  typeArrayToArray
}