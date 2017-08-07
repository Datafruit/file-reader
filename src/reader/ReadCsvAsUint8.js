import { CSVParser } from '../parser/csv'
import { UTF8Parser } from '../parser/utf8'
import { inherits } from '../util/util'
import { BaseReader } from '../base/BaseReader'
import { ReadLineAsUint8 } from './ReadLineAsUint8'
const LINE_MARK = ReadLineAsUint8.Type.line

/**
 * @param {File} file
 * @param {LineReaderOptions} [options]
 * @extends {BaseReader}
 * @constructor
 */
const ReadCsvAsUint8 = function (file, options) {
  options = options || {}
  BaseReader.call(this, options.concurrency)
  this.file = file
  this.options = options
  this.reader = new ReadLineAsUint8(file, options)
  this.csvParser = new CSVParser(options.separator, options.quotation)
  this.utf8Parser = new UTF8Parser()
  this.count = 0
  this._listen()
}

inherits(ReadCsvAsUint8, BaseReader)

/**
 * @return {ReadCsvAsUint8}
 * @private
 */
ReadCsvAsUint8.prototype._listen = function () {
  this.reader.subscribe(
    (record) => this._onNext(record),
    (message, already, read_size) => this.onReadError(message, already, read_size),
    () => this.onReadComplete()
  )
  return this
}

/**
 * @param record
 * @return {ReadCsvAsUint8}
 * @private
 */
ReadCsvAsUint8.prototype._onNext = function (record) {

  const type = record.type
  if (type === LINE_MARK) return this

  const { data, size } = record
  const start = record.no - data.length + 1
  const utf8 = this.utf8Parser
  const csv = this.csvParser

  if (data.length === 0) return this
  if (start === 1) data[0].line = utf8.filterOutBOM(data[0].line).array

  const lines = []
  const end = data.length

  let i = 0, rc, arr, fields, no

  for (; i < end; i++) {
    // 完整性检测太耗时，直接去csvParser中抛出错误即可
    // 类似于 1\n2\n3 这样的段，直接扔错误
    rc = data[i]
    arr = rc.line
    if (arr.byteLength === 0) continue

    // catch parse error and stop reading
    no = ++this.count
    try {
      fields = csv.parse(arr)
    } catch (e) {
      this.onReadError({ no, body: rc.line })
      this.stop()
      // skip current line
      continue
    }

    lines.push({
      fields,
      size: rc.size,
      no
    })
  }

  this.enqueue({ lines, size })
  this.onReadData()
  return this
}

/**
 * @return {ReadCsvAsUint8}
 */
ReadCsvAsUint8.prototype.read = function () {
  this.reader.read()
  return this
}

/**
 * @return {ReadCsvAsUint8}
 */
ReadCsvAsUint8.prototype.pause = function () {
  this.reader.pause()
  return this
}

/**
 * @return {ReadCsvAsUint8}
 */
ReadCsvAsUint8.prototype.resume = function () {
  this.reader.resume()
  return this
}

export { ReadCsvAsUint8 }

