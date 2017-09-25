/**
 * Created by coin on 07/01/2017.
 */

import { BaseReader } from '../base/BaseReader'
import { inherits } from '../util/util'

/**
 * @property {String} [encode]
 * @property {Number} [read_size]
 * @property {Number} [chunk_size]
 * @property {Number} [concurrency]
 * @mixin ReaderOptions
 */
const DefOpt = {
  // 文件编码
  encode: 'utf8',
  // 读取大小,如果不传,则为 file.size, 如果传入的值大于了 file.size
  // 那么不好意思,你永远收不到结束标识
  read_size: 0,
  // 每一片的大小,不要过大,否则有可能爆栈。
  chunk_size: 1 << 16,
  // 并发数据。读取速度与并发数并不成正比,此值可以不用改动
  concurrency: 1
}

const ReadTypes = {
  Text: 'Text',
  ArrayBuffer: 'ArrayBuffer',
  DataURL: 'DataURL'
}

let __window
let FileReader

try {
  __window = window
} catch (e) {
  __window = global.window
} finally {
  FileReader = __window.FileReader
}

/**
 * @param {File} file
 * @param {Object} [options]
 * @extends BaseReader
 * @constructor
 */
const BrowserFileReader = function (file, options) {
  options = Object.assign({}, DefOpt, { read_size: file.size }, options)
  BaseReader.call(this, options.concurrency)
  this.options = options
  this.file = file
  this.already = 0
  this.readType = `readAs${ReadTypes.ArrayBuffer}`
}

inherits(BrowserFileReader, BaseReader)

/**
 * @param {String} type
 * @return {BrowserFileReader}
 * @private
 */
BrowserFileReader.prototype._setting = function (type) {
  this.readType = `readAs${type}`
  this._read()
  return this
}

/** @return {BrowserFileReader} */
BrowserFileReader.prototype.readAsText = function () {
  return this._setting(ReadTypes.Text)
}

/** @return {BrowserFileReader} */
BrowserFileReader.prototype.readAsArrayBuffer = function () {
  return this._setting(ReadTypes.ArrayBuffer)
}

/** @return {BrowserFileReader} */
BrowserFileReader.prototype.readAsDataURL = function () {
  this._setting(ReadTypes.DataURL)
  this.options.read_size = this.file.size
  return this
}

/**
 * @override
 * @return {BrowserFileReader}
 */
BrowserFileReader.prototype.read = function () {
  return this._read()
}

/**
 * @return {BrowserFileReader}
 * @private
 */
BrowserFileReader.prototype._read = function () {
  while (this.readable()) {
    if (!this._next()) {
      break
    }
  }
  return this
}

/**
 * 读取一次数据，返回值为boolean，表示是否读取成功
 * @return {Boolean}
 * @private
 */
BrowserFileReader.prototype._next = function () {
  const r = this
  const opt = r.options
  let start, end

  if (r.done()) {
    return false
  }

  start = r.already
  end = start + opt.chunk_size

  if (end > opt.read_size) {
    end = opt.read_size
  }

  r._slice(start, end)
  r.already = end
  return true
}

/**
 * 切片文件
 * @param {Number} start
 * @param {Number} end
 * @return {BrowserFileReader}
 * @private
 */
BrowserFileReader.prototype._slice = function (start, end) {
  const file = this.file
  const readType = this.readType
  const blob = file.slice(start, end)
  const reader = new FileReader()
  const record = { reader, start, end }

  this.enqueue(record)
  reader.onerror = () => this._onReadError(record)
  reader.onloadend = () => this._onReadData()

  reader[readType](blob, this.options.encode)
  return this
}

/**
 * @return {Boolean}
 */
BrowserFileReader.prototype.done = function () {
  return this.already === this.options.read_size
}

/**
 * @param record
 * @return {BaseReader}
 * @private
 */
BrowserFileReader.prototype._onReadError = function (record) {
  return this.onReadError({
    error: record.reader.error,
    already: this.already,
    read_size: this.options.read_size
  })
}

/**
 * @return {BaseReader}
 * @private
 */
BrowserFileReader.prototype._onReadData = function () {
  return this.onReadData()
}

/**
 * @param record
 * @param sequence
 * @override
 * @return {Boolean}
 */
BrowserFileReader.prototype.validate = function (record, sequence) {
  return record.reader.readyState === FileReader.DONE
}

/**
 * @param {*} record
 * @override
 * @param {Number} [sequence]
 */
BrowserFileReader.prototype.result = function (record, sequence) {
  return record.reader.result
}

/**
 * @param record
 * @param size
 * @override
 * @return {Boolean}
 */
BrowserFileReader.prototype.isLastSnippet = function (record, size) {
  return record.end === this.options.read_size
}

export  { BrowserFileReader, DefOpt }