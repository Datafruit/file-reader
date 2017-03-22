/**
 * Created by coin on 07/01/2017.
 */

import { AbstractReader } from '../abstract'
import { BaseObservable } from '../base/BaseObservable'
import { inherits, arrayLikeToArray } from '../util/util'
import { Queue } from '../util/queue'

/**
 * @param {number} [concurrency]
 * @extends AbstractReader
 * @extends BaseObservable
 * @constructor
 */
const BaseReader = function (concurrency) {
  AbstractReader.call(this)
  BaseObservable.call(this)
  this._readable = true
  this.queue = new Queue(concurrency)
  this.chunks = 0
}

inherits(BaseReader, AbstractReader)
inherits(BaseReader, BaseObservable)

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.read = function () {
  if (!this._readable) return this
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.pause = function () {
  this._readable = false
  return this
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.resume = function () {
  this._readable = true
  this.read()
  return this
}

/**
 * @override
 * @return {boolean}
 */
BaseReader.prototype.readable = function () {
  return this._readable && !this.queue.full()
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.enqueue = function (data) {
  if (this.queue.full()) return this
  this.queue.queue({ data: data, sequence: this.chunks++ })
  return this
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.onReadData = function () {
  const queue = this.queue
  let prev, next, done
  
  while ((next = queue.dequeue()) !== null) {
    done = this.validate(next.data, next.sequence)
    
    if (!done) {
      queue.rollback()
      break
    }
    
    if (done) {
      this.subscribeOnNext(this.result(next.data), next.sequence)
    }
    
    prev = next
  }
  
  if (this.isLastSnippet(prev.data, prev.sequence)) {
    this.onReadComplete()
  } else if (this.readable()) {
    this.read()
  }
  
  return this
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.onReadError = function () {
  this.subscribeOnError.apply(this, arrayLikeToArray(arguments))
  return this
}

/**
 * @override
 * @return {BaseReader}
 */
BaseReader.prototype.onReadComplete = function () {
  this.subscribeOnComplete.apply(this, arrayLikeToArray(arguments))
  return this
}

/**
 * @override
 * @param {*} data
 * @param {number} [sequence]
 * @return {boolean}
 */
BaseReader.prototype.validate = function (data, sequence) {
  return sequence !== void 0
}

/**
 * @override
 * @param {*} data
 * @param {number} [sequence]
 * @return {*}
 */
BaseReader.prototype.result = function (data, sequence) {
  return data
}

/**
 * @param {*} data
 * @param {number} [sequence]
 * @return {boolean}
 */
BaseReader.prototype.isLastSnippet = function (data, sequence) {
  return false
}

export { BaseReader }

