所有的`Base`类为实现[Abstract](./Abstract.md)的基类。
开发时可以直接继承`Base`类，不必再去实现[Abstract](./Abstract.md)。

# BaseObserver([onNext], [onError], [onComplete])

### Implement
+ [AbstractObserver](./Abstract.md#abstractobserver)

### 参数说明
+ onNext {Function}
+ onError {Function}
+ onComplete {Function}

### 实例方法
+ onNext(...args) ： `BaseObserver`
+ onError(...args) ： `BaseObserver`
+ onComplete(...args) : `BaseObserver`
+ destroy() : `BaseObserver`
+ isDestroy() : `boolean`

### 静态方法
+ BaseObserver.isObserver(any) : `boolean`

### Simple
```js
 const ob = new BaseObserver(
   (data) => console.log('onNext => %s', data),
   (data) => console.log('onError => %s', data),
   (data) => console.log('onComplete => %s', data)
 )
 ob.onNext(1)        // log => 'onNext => 1'
 ob.onError(2)       // log => 'onError => 2'
 ob.onComplete(3)    // log => 'onComplete => 3'
```

# BaseObservable

### 表态方法
+ subscribe(observerOrOnNext, [onError], [onComplete]) : `BaseObservable`
+ subscribeOnNext(...args) : `BaseObservable`
+ subscribeOnError(...args) : `BaseObservable`
+ subscribeOnComplete(...args) : `BaseObservable`

### Simple
```js
const onNext = (data) => console.log('onNext => %s', d)
const onError = (data) => console.log('onError => %s', d)
const onComplete = (data) => console.log('onComplete => %s', d)
// 创建实例 
const obs = new BaseObservable()
// 订阅
obs.subscribe(onNext, onError, onComplete)
// 或者
const ob = new BaseObserver(onNext, onError, onComplete)
obs.subscribe(ob)
```

# BaseReader([concurrency])
 
### Implement
+ [AbstractReader](./Abstract.md#abstractreader)
+ [BaseObservable](#baseobservable)

### 参数说明
+ concurrency {Number} - 最大并发数，默认为1

### override
+ read() : `BaseReader`
+ pause() : `BaseReader`
+ resume() : `BaseReader`
+ readable() : `booealn`
+ enqueue(data): `BaseReader`
+ onReadData(): `BaseReader`
+ onReadError() : `BaseReader`
+ onReadComplete() : `BaseReader`
+ validate(data, [sequence]) : `boolean`
+ result(data, [sequence]) : `*`
+ isLastSnippet(data, [sequence]) : `boolean`

`BaseReader`一般不直接调用，由开发者实现的`Reader`继承该类并重写该类的一些方法

