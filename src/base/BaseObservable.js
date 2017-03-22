/**
 * Created by coin on 07/01/2017.
 */

import { AbstractObservable } from '../abstract'
import { BaseObserver } from './BaseObserver'
import { inherits, arrayLikeToArray } from '../util/util'

/**
 * @extends AbstractObservable
 * @constructor
 */
const BaseObservable = function () {
  AbstractObservable.call(this)
  this.observer = null
}

inherits(BaseObservable, AbstractObservable)

/**
 * 注册观察者
 * @param {Function|BaseObserver} observerOrOnNext
 * @param {Function} [onError]
 * @param {Function} [onComplete]
 * @override
 * @return {BaseObservable}
 */
BaseObservable.prototype.subscribe = function (observerOrOnNext, onError, onComplete) {
  this.observer = BaseObserver.isObserver(observerOrOnNext)
    ? observerOrOnNext
    : new BaseObserver(observerOrOnNext, onError, onComplete)
  return this
}

/**
 * @override
 * @return {BaseObservable}
 */
BaseObservable.prototype.subscribeOnNext = function () {
  const observer = this.observer
  if (observer) {
    observer.onNext.apply(observer, arrayLikeToArray(arguments))
  }
  return this
}

/**
 * @override
 * @return {BaseObservable}
 */
BaseObservable.prototype.subscribeOnError = function () {
  const observer = this.observer
  if (observer) {
    observer.onError.apply(observer, arrayLikeToArray(arguments))
  }
  return this
}

/**
 * @override
 * @return {BaseObservable}
 */
BaseObservable.prototype.subscribeOnComplete = function () {
  const observer = this.observer
  if (observer) {
    observer.onComplete.apply(observer, arrayLikeToArray(arguments))
  }
  return this
}

export { BaseObservable }
  
  