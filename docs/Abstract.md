# AbstractObserver 观察者
观察者有三种状态 `error`, `next`, `complete`，由用户自己定义

### 实例方法
+ error
+ next
+ complete
+ onNext
+ onError
+ onComplete
+ inDestroy

# AbstractObservable 可观察
可观察表示可以注册观察者。
会在合适的情况下调用观察者的几个状态`error`,`next`,`complete`

### 实例方法
+ subscribe
+ subscribeOnNext
+ subscribeOnError
+ subscribeOnComplete

# AbstractReader 
extends [AbstractObservable](#abstractobservable)

### 实例方法
+ read() - 开始读取
+ pause() - 暂停读取
+ resume() - 继续读取
+ enqueue(record) - 记录数据
+ onReadData() - 有数据时完成时
+ onReadError(error, already, read_size) - 读取出错
+ onReadComplete() - 读取完成
+ readable() - 是否可以读取
+ validate(record) - 验证数据片段是否可以发送给 `Observer`
+ result(record) - 获取数据结果
+ isLastSnippet(record) - 是否是最后一个片段，该方法可能被删除，不要再自行实现
