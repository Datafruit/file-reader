/**
 * Created by coin on 07/01/2017.
 */

import { AbstractObserver } from '../abstract'
import { noop, inherits, arrayLikeToArray, isFunction, isObject } from '../util/util'

/**
 * @param {Function} [onNext]
 * @param {Function} [onError]
 * @param {Function} [onComplete]
 * @extends AbstractObserver
 * @constructor
 */
const BaseObserver = function (onNext, onError, onComplete) {
  AbstractObserver.call(this)
  this.destroyed = false
  this.next = isFunction(onNext) ? onNext : this.next
  this.error = isFunction(onError) ? onError : this.error
  this.complete = isFunction(onComplete) ? onComplete : this.complete
}

inherits(BaseObserver, AbstractObserver)

BaseObserver.prototype.next = noop
BaseObserver.prototype.error = noop
BaseObserver.prototype.complete = noop

/** @return {BaseObserver} */
BaseObserver.prototype.onNext = function () {
  if (!this.destroyed) {
    this.next.apply(this, arrayLikeToArray(arguments))
  }
  return this
}

/** @return {BaseObserver} */
BaseObserver.prototype.onError = function () {
  if (!this.destroyed) {
    this.error.apply(this, arrayLikeToArray(arguments))
  }
  return this
}

/** @return {BaseObserver} */
BaseObserver.prototype.onComplete = function () {
  if (!this.destroyed) {
    this.complete.apply(this, arrayLikeToArray(arguments))
  }
  return this
}

/** @return {BaseObserver} */
BaseObserver.prototype.destroy = function () {
  this.destroyed = true
  return this
}

/** @return {Boolean} */
BaseObserver.prototype.isDestroy = function () {
  return this.destroyed
}

/** @return {Boolean} */
BaseObserver.isObserver = function (any) {
  return any instanceof BaseObserver || (
      isObject(any) && (
        isFunction(any.onNext) &&
        isFunction(any.onError) &&
        isFunction(any.onComplete)
      )
    )
}

export { BaseObserver }
  
  