/**
 * Created by coin on 21/12/2016.
 */

/**
 * @example
 * const scheduler = new Scheduler(5)
 *
 * scheduler.subscribe((next) => {
 *   send(next).then(() => scheduler.release(next))
 * })
 *
 * while(conditional){
 *   scheduler.entry()
 * }
 *
 */
export class Scheduler {
  constructor (max_tasks) {
    this.max_tasks = max_tasks
    this.buffer = []
    this.subscribers = []
    this.scheduled = []
  }
  
  subscribe (fn) {
    this.subscribers.push(fn)
    return this
  }
  
  entry (data) {
    this.buffer.push(data)
    this.dispose()
    return this
  }
  
  // TODO 以进程ID的方式释放
  release (data) {
    const { scheduled } = this
    const index = scheduled.indexOf(data)
    if (index === -1) {
      return false
    }
    scheduled.splice(index, 1)
    return this.dispose()
  }
  
  dispose () {
    const { buffer, subscribers, scheduled, max_tasks } = this
    let data
    let state = false
    
    while (scheduled.length < max_tasks && buffer.length > 0) {
      state = true
      data = buffer[0]
      scheduled.push(data)
      buffer.splice(0, 1)
      subscribers.forEach(fn => fn(data))
    }
    return state
  }
  
  /**
   * 重新装入
   * @param data
   * @return {Scheduler}
   */
  reEntry (data) {
    if (this.buffer.indexOf(data) !== -1) {
      this.dispose()
      return this
    }
    this.entry(data)
    if (!this.release(data)) {
      this.dispose()
    }
    return this
  }
  
  /**
   * 任务是否排满
   * @returns {Boolean}
   */
  tight () {
    return this.scheduled.length > this.max_tasks
  }
  
  /**
   * 缓存是否清空
   * @returns {Boolean}
   */
  drain () {
    return this.buffer.length === 0
  }
  
  /**
   * 缓存是否装满
   * @returns {Boolean}
   */
  overflowed () {
    return this.buffer.length > this.max_tasks
  }
  
  /**
   * 任务全部完成
   */
  accomplish () {
    return this.scheduled.length === 0
  }
}