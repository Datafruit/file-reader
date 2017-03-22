/**
 * Created by coin on 07/01/2017.
 */

import { ReadLineAsUint8 } from './ReadLineAsUint8'
import { BaseReader } from '../base/BaseReader'
import { UTF8Parser } from '../parser/utf8'
import { inherits } from '../util/util'

const Type = Object.assign({}, ReadLineAsUint8.Type)

/**
 * @param {File} file
 * @param {LineReaderOptions} [options]
 * @extends {BaseReader}
 * @constructor
 */
const ReadLineAsString = function (file, options) {
  options = options || {}
  BaseReader.call(this, options.concurrency)
  this.options = options
  this.reader = new ReadLineAsUint8(file, options)
  this.utf8_parser = new UTF8Parser()
  this._listen()
}

inherits(ReadLineAsString, BaseReader)

/**
 * @return {ReadLineAsString}
 * @private
 */
ReadLineAsString.prototype._listen = function () {
  this.reader.subscribe(
    (data) => {
      if (data.type === Type.lines) {
        this._receive(data.data, data.no, data.size)
      }
    },
    (message, already, read_size) => {
      this.onReadError(message, already, read_size)
    },
    () => {
      this.onReadComplete()
    }
  )
  return this
}

/**
 * @param lines
 * @param no
 * @param size
 * @return {ReadLineAsString}
 * @private
 */
ReadLineAsString.prototype._receive = function (lines, no, size) {
  const length = lines.length
  const str_list = []
  const parse = this.utf8_parser
  const start = no - length + 1
  let str, character
  
  lines.forEach((line, i) => {
    character = parse.entry(line.line)
    
    str = String.fromCodePoint.apply(String, character.character)
    str_list.push(str)
    
    this.enqueue({
      type: Type.line,
      data: str,
      no: start + i,
      size: line.size
    })
    this.onReadData()
  })
  
  this.enqueue({
    type: Type.lines,
    data: str_list,
    no: no,
    size: size
  })
  this.onReadData()
  return this
}

/**
 * @return {ReadLineAsString}
 */
ReadLineAsString.prototype.read = function () {
  this.reader.read()
  return this
}

/**
 * @return {ReadLineAsString}
 */
ReadLineAsString.prototype.resume = function () {
  this.reader.resume()
  return this
}

/**
 * @return {ReadLineAsString}
 */
ReadLineAsString.prototype.pause = function () {
  this.reader.pause()
  return this
}

ReadLineAsString.Type = Type

export { ReadLineAsString }

