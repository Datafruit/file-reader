/**
 * Created by coin on 17/12/2016.
 */

const MAX_QUEUE = 50

/**
 * 有序读取序列
 * @constructor
 */

export class Queue {
  constructor (max_queue) {
    this._queue = null
    this._point = null
    this._total = null
    this._max_queue = max_queue || MAX_QUEUE
    // 实际缓存最大可达到 max_queue * 2
    this.reset([])
  }

  reset (queue) {
    this._queue = queue
    this._point = 0
    this._total = queue.length
    return this
  }

  /**
   * 压入数据,如果成功,返回`true`,失败返回 `false`
   * @param data
   * @returns {Boolean}
   */
  queue (data) {
    if (this.full()) {
      return false
    }
    this._total = this._queue.push(data)
    return true
  }

  /**
   * 取出数据,如果有值,返回存入的值,没有则返回 `null`
   * @returns {null | *}
   */
  dequeue () {
    if (!this.done()) {
      // 达到最大缓存时,清除一次缓存
      if (this._point === this._max_queue) {
        this.reset(this._queue.slice(this._point))
      }
      return this._queue[this._point++]
    }
    this.reset([])
    return null
  }

  /**
   * 是否达到最大缓存
   * @returns {Boolean}
   */
  full () {
    return this.undequeued() === this._max_queue
  }

  /**
   * 未读出队列的数量
   * @returns {Number}
   */
  undequeued () {
    return this._total - this._point
  }

  /**
   * 是否全部执行
   * @returns {Boolean}
   */
  done () {
    return this.undequeued() === 0
  }

  /**
   * 遍历所有的未取出数据
   * @param fn
   * @returns {Queue}
   */
  forEach (fn) {
    let next
    while (next = this.dequeue()) {
      fn(next)
    }
    return this
  }

  /**
   * 指针回滚
   * @returns {Number}
   */
  rollback () {
    if (this._point > 0) {
      this._point--
    }
    return this._point
  }

  /**
   * 指针前进
   * @returns {Number}
   */
  forward () {
    if (this._point < this._total) {
      this._point++
    }
    return this._point
  }
}
