/**
 * Created on 11/03/2017.
 */

import { ReadCsvAsUint8 } from './ReadCsvAsUint8'
import { BaseReader } from '../base/BaseReader'
import { UTF8Parser } from '../parser/utf8'
import { inherits } from '../util/util'

/**
 * @param file
 * @param {number} lines
 * @param {} options
 * @constructor
 */
const ReadCsvWithLines = function (file, lines, options) {
  BaseReader.call(this, options)
  this.file = file
  this.total = lines
  this.reader = new ReadCsvAsUint8(file, options)
  this.already = 0
  this.utf8_parser = new UTF8Parser()
  this._listen()
}

inherits(ReadCsvWithLines, BaseReader)

/**
 * @return {ReadCsvWithLines}
 * @private
 */
ReadCsvWithLines.prototype._listen = function () {
  this.reader.subscribe(
    record => this._receive(record),
    (message, already, read_size) => this.onReadError(message, already, read_size),
    () => this.onReadComplete()
  )
  return this
}

/**
 * @param record
 * @return {ReadCsvWithLines}
 * @private
 */
ReadCsvWithLines.prototype._receive = function (record) {
  const { lines, size } = record
  const total = this.total
  const len = lines.length
  let already = this.already
  
  if (already >= total) return this
  if (already + len > total) this.pause()
  
  const need = total - already
  const num = need <= len ? need : len
  const next = []
  const parser = this.utf8_parser
  
  for (let i = 0, r; i < num; i++) {
    r = lines[i]
    next.push({
      ...r,
      fields: r.fields.map(f => String.fromCodePoint.apply(String, parser.parse(f).character))
    })
  }
  
  this.enqueue({ lines: next, size })
  this.onReadData()
  
  already = already + num
  if (already >= total) this.onReadComplete()
  this.already = already
  return this
}

/**
 * @return {ReadCsvWithLines}
 */
ReadCsvWithLines.prototype.read = function () {
  this.reader.read()
  return this
}

/**
 * @return {ReadCsvWithLines}
 */
ReadCsvWithLines.prototype.pause = function () {
  this.reader.pause()
  return this
}

/**
 * @return {ReadCsvWithLines}
 */
ReadCsvWithLines.prototype.resume = function () {
  this.reader.resume()
  return this
}

export { ReadCsvWithLines }

