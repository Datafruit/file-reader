/**
 * Created by coin on 06/01/2017.
 */

import { NotImplemented } from '../exceptions'
import { inherits } from '../util/util'

const notImplemented = function (name) {
  return function () {
    throw new NotImplemented(`method: ${name} not implement`)
  }
}

/**
 * 观察者有三种状态 `error`, `next`, `complete`
 * 由用户自己定义
 * 在适合的时候由`Scheduler`调用
 * 所有的观察者都应交由`Scheduler`处理
 * @abstract
 */

const AbstractObserver = function () {}
/** 接收错误信息,可能多次调用 */
AbstractObserver.prototype.error = notImplemented('Observer.error')
/** 接收数据,可能多次调用 */
AbstractObserver.prototype.next = notImplemented('Observer.next')
/** 完成状态 */
AbstractObserver.prototype.complete = notImplemented('Observer.complete')
/** 是否被销毁, 如果已经被销毁, `Scheduler` 可以移除该 `Observer` */
AbstractObserver.prototype.onNext = notImplemented('Observer.onNext')
AbstractObserver.prototype.onError = notImplemented('Observer.onError')
AbstractObserver.prototype.onComplete = notImplemented('Observer.onComplete')
AbstractObserver.prototype.isDestroy = notImplemented('Observer.isDestroy')

/**
 * 可以观察表示可以注册观察者`Observer`
 * 会在合适的情况下调用观察者的几个状态`error`,`next`,`complete`
 * @abstract
 */
const AbstractObservable = function () {}
/** 注册`Observable` */
AbstractObservable.prototype.subscribe = notImplemented('Observable.subscribe')
AbstractObservable.prototype.subscribeOnNext = notImplemented('Observable.subscribeOnNext')
AbstractObservable.prototype.subscribeOnError = notImplemented('Observable.subscribeOnError')
AbstractObservable.prototype.subscribeOnComplete = notImplemented('Observable.subscribeOnComplete')

/**
 * 分片读取
 * @extends AbstractObservable
 * @abstract
 */
const AbstractReader = function () { AbstractObservable.call(this) }
inherits(AbstractReader, AbstractObservable)
/** 开始读取 */
AbstractReader.prototype.read = notImplemented('Reader.read')
/** 暂停读取 */
AbstractReader.prototype.pause = notImplemented('Reader.pause')
/** 继续读取 */
AbstractReader.prototype.resume = notImplemented('Reader.resume')
/** 记录数据 */
AbstractReader.prototype.enqueue = notImplemented('Reader.enqueue')
/** 有数据时完成时 */
AbstractReader.prototype.onReadData = notImplemented('Reader.onReadData')
/** 读取出错 */
AbstractReader.prototype.onReadError = notImplemented('Reader.onReadError')
/** 读取完成 */
AbstractReader.prototype.onReadComplete = notImplemented('Reader.onReadComplete')
/** 是否可以读取 */
AbstractReader.prototype.readable = notImplemented('Reader.readable')
/** 验证数据片段是否可以发送给 `Observer` */
AbstractReader.prototype.validate = notImplemented('Reader.validate')
/** 获取数据结果 */
AbstractReader.prototype.result = notImplemented('Reader.result')
/** 是否是最后一个片段 */
AbstractReader.prototype.isLastSnippet = notImplemented('Reader.isLastSnippet')

export {
  AbstractReader,
  AbstractObserver,
  AbstractObservable
}
