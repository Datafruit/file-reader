/**
 * Created by coin on 07/01/2017.
 */

import { BrowserFileReader, DefOpt as ReaderOpt } from './BrowserFileReader'
import { BaseReader } from '../base/BaseReader'
import { inherits, short_id } from '../util/util'

/**
 * @property {Boolean} ignore_line_break
 * @property {Number} separator
 * @property {Number} quotation
 * @mixes ReaderOptions
 * @mixin LineReaderOptions
 */
const DefOpt = Object.assign({ ignore_line_break: true }, ReaderOpt)

// 换行符 => Unix: \n, windows: \r\n
const LF = 0xA
const BS = 0x8
const CR = 0xD

const Type = {
  line: short_id(),
  lines: short_id()
}

/**
 * @param {File} file
 * @param {LineReaderOptions} [options]
 * @extends {BaseReader}
 * @constructor
 */
const ReadLineAsUint8 = function (file, options) {
  options = Object.assign({}, DefOpt, { read_size: file.size }, options)
  BaseReader.call(this, options.concurrency)
  this.options = options
  this.file = file
  this.reader = new BrowserFileReader(file, this.options)
  this.cache = []
  this.total_lines = 0
  this._listen()
}

inherits(ReadLineAsUint8, BaseReader)

/**
 * @return {ReadLineAsUint8}
 */
ReadLineAsUint8.prototype._listen = function () {
  this.reader.subscribe(
    (array_buffer, sequence) => this._receive(array_buffer),
    (message, already, read_size) => this.onReadError(message, already, read_size),
    () => {
      if (this.cache.length) {
        const buf = new Uint8Array(this.cache.concat(LF))
        this.cache = []
        this._receive(buf)
      }
      this.onReadComplete()
    }
  )
  return this
}

/**
 * 接收到reader的数据是一个 `ArrayBuffer`,需要遍历 `ArrayBuffer` 的内容
 * 按行分割,返回包含完整行的 `Array`,并触发 `line` 与 `lines` 事件
 * @param {ArrayBuffer} array_buffer
 * @return {ReadLineAsUint8}
 * @private
 */
ReadLineAsUint8.prototype._receive = function (array_buffer) {
  const array = this._concat(array_buffer)

  if (array === null) {
    return this
  }

  this._send_lines(this.options.ignore_line_break
    ? this._ignore_line_break(array)
    : this._normal_receive(array)
  )
}

/**
 * 将接收到的 `ArrayBuffer` 组装为 `Uint8Array`
 * @param {ArrayBuffer} array_buffer
 * @return {Uint8Array | null}
 * @private
 */
ReadLineAsUint8.prototype._concat = function (array_buffer) {
  const buf_len = array_buffer.byteLength

  if (buf_len === 0) {
    return null
  }

  const cache = this.cache
  const length = cache.length + buf_len
  const array = new Uint8Array(length)
  const buf = new Uint8Array(array_buffer)
  array.set(cache)
  array.set(buf, cache.length)
  return array
}

/**
 * 忽略换行符(LF)和退格符(BS)
 * @param array
 * @return {Array}
 * @private
 */
ReadLineAsUint8.prototype._ignore_line_break = function (array) {
  const length = array.byteLength
  const lines = []
  let line = []
  let size = 0
  let point = 0
  let code

  while (point < length) {
    code = array[point++]
    size++
    // TODO 性能优化，试着减少判断
    if (code === LF) {
      lines.push({ line, size })
      line = []
      size = 0
    } else if (code !== BS && code !== CR) {
      line.push(code)
    }
  }

  this.cache = line

  return lines
}

/**
 * 正常解析内容,不忽略换行符(LF)和退格符(BS)
 * @param array
 * @return {Array}
 * @private
 */
ReadLineAsUint8.prototype._normal_receive = function (array) {
  const length = array.byteLength
  const lines = []
  let line = []
  let size = 0
  let point = 0
  let code

  while (point < length) {
    code = array[point++]
    size++
    line.push(code)
    if (code === LF) {
      lines.push({ line, size })
      line = []
      size = 0
    }
  }

  this.cache = line

  return lines
}

/**
 * 发送行数据
 * @param lines
 * @private
 */
ReadLineAsUint8.prototype._send_lines = function (lines) {
  const lines_record = []
  let array = void 0
  let total_size = 0
  let total_line = this.total_lines

  if (lines.length > 0) {
    lines.forEach(line => {
      total_size += line.size
      array = new Uint8Array(line.line)
      lines_record.push({ line: array, size: line.size })

      this.enqueue({
        type: Type.line,
        data: array,
        no: ++total_line,
        size: line.size
      })
      this.onReadData()
    })

    this.total_lines = total_line

    this.enqueue({
      type: Type.lines,
      data: lines_record,
      no: total_line,
      size: total_size
    })
    this.onReadData()
  }
}

/**
 * @return {ReadLineAsUint8}
 */
ReadLineAsUint8.prototype.read = function () {
  this.reader.readAsArrayBuffer()
  return this
}

/**
 * @return {ReadLineAsUint8}
 */
ReadLineAsUint8.prototype.resume = function () {
  this.reader.resume()
  return this
}

/**
 * @return {ReadLineAsUint8}
 */
ReadLineAsUint8.prototype.pause = function () {
  this.reader.pause()
  return this
}

ReadLineAsUint8.Type = Type

export { ReadLineAsUint8, DefOpt }

