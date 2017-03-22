# FileReader 文档
该库最开始建立目标为读取Csv文件，并且解析成需要的格式（字符串、按行解析成字段）。
随着后其加入的功能越来越多，此库目标变为：成为`javaScript`环境统一处理 _按序读取异步数据_ 的基类
以及一个 _原始文件解析器_ 。

# 按序读取异步数据
在读取大文件时，不可能一次全部读入内存，需要分片。
但是各个分片完成的时间并不是按顺序的。假设我们同时发出两个异步读取，分别命名为`r1`,`r2`。
```js
 const bigFileInst = new Blob()
 const r1 = new FileReader()
 const r2 = new FileReader()
 r1.onloadend = () => console.log(r1.result)
 r2.onloadend = () => console.log(r2.result)
 r1.readAsArrayBuffer(bigFileInst.slice(0, 100))
 r2.readAsArrayBuffer(bigFileInst.slice(100, 200))
```
由于`javaScript`异步机制，此时，并不能保证`r1`先于`r2`完成。如果不能按顺序取得源数据，
在解析的时候将会出现错误。

# 实现原理
1. 创建一个`BaseReader`类来管理读取过程中得到的数据。`BaseReader`是一个可观察的类(`Observable`)，
   所有的`Reader`都继承该类。
2. 当`Reader`开始读取内容时，将数据存入`BaseReader`，将会得到一个记录集合，记为`S(n)`。
3. 当`Reader`读取完成一个分片时，通知`BaseReader`，`BaseReader`将会从头开始遍历`S(n)`。
   检测每一个记录的状态，如果第一个记录完成读取，则向观察者传递该记录。
4. 重复`2~3`过程
   
   
# 原始文件解析器
在`javaScript`环境(`nodejs`,`browser`)，甚至是所有的语言环境中，文件只是一堆编码数据，
大多为`unsigned int`类型。

在程序中表现为一个`Buffer`。
要将这些文件解析成正确的内容，首先要确定文件的编码方式，之后按照编码方式解析为正确的编码数字，
对应码表，查出实际内容。

```js
const utf8 ='UTF8ParserCreatedByYou'
const buf = [230, 156, 128, 230, 152, 175, 228, 186, 186, 233, 151, 180, 231, 149, 153, 228, 184, 141, 228, 189, 143]
const str = utf8.parse(buf).toString() // 最是人间留不住
```

所以，要将一个文件内容正确的展示给用户看，仅有`Reader`是不够的，还需要有`parser`。
准确的说还需要有一堆`parser`。

该库将`parser`分为两类：
1. 原始编码解析器：`utf8`,`ucs2`,`gbk`,`utf16`...
2. 特定文件解析器：`csv`,`excel`...


# 文档
1. [Abstract](./Abstract.md)
2. [Base](./Base.md)
3. [Reader](./Reader.md)
4. Parser，TODO
5. Util，TODO

_热烈欢迎大家补充`parser`，目前只有`utf8`与`ucs2`，太少了。_

