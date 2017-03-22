/**
 * Created by coin on 06/01/2017.
 */

const CodeRange = function (message) {
  Error.call(this)
  this.message = message || '编码范围错误:编码原始值正确范围是[0-255]'
}
CodeRange.prototype = Error.prototype

const ContentFormat = function (message) {
  Error.call(this)
  this.message = message || '内容格式错误'
}
ContentFormat.prototype = Error.prototype

const NotImplemented = function (message) {
  Error.call(this)
  this.message = message || 'Not implement'
}
NotImplemented.prototype = Error.prototype

const IllegalityStructure = function (message) {
  Error.call(this)
  this.message = message || 'The object of passed is illegality'
}
IllegalityStructure.prototype = Error.prototype

export {
  CodeRange,
  ContentFormat,
  NotImplemented,
  IllegalityStructure
}
