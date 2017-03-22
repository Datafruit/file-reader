# ReaderOptions
+ {string} encode - 文件编码，默认为`utf8`
+ {number} read_size - 总读取量，默认为`file.size`
+ {number} concurrency - 并发读取数，默认为`1`
+ {number} chunk_size - 每个分片大小，默认为`1 << 16`

# BrowserFileReader(file, [options])
浏览器上的文件读取类，需要浏览器支持
[`FileReader`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
与
[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
类

### 参数说明
+ {File} file
+ {[ReaderOptions](#readeroptions)} [options]

### Extends
+ [BaseReader](./Base.md#basereader)

### 静态方法
+ readAsText(): `BrowserFileReader`
+ readAsArrayBuffer(): `BrowserFileReader`
+ readAsDataURL(): `BrowserFileReader`
+ read(): `BrowserFileReader`
+ next(): `BrowserFileReader`
+ slice(start, end): `BrowserFileReader`
+ done(): `boolean`
+ validate(record, sequence): `boolean`
+ result(record, sequence): `*`
+ isLastSnippet(record, sequence): `boolean`

### Simple
```js
import { BrowserFileReader } from 'file-reader'
const target = document.querySelector('#file')
target.onchange = () => {
  const file = target.files[0]
  const reader = new BrowserFileReader(file)
  reader.subscribe(
    (data, sequence) => console.log('onNext::', data, sequence),
    (error, already, read_size) => console.log('onError::', error, already, read_size),
    () => console.log('onCompleted')
  )
  reader.read()    // same as reader.readAsArrayBuffer()
  // or
  reader.readAsArrayBuffer()
  // or
  reader.readAsText()
  // or
  reader.readAsDataURL()
}
```

# LineReaderOptions
### Mixin [ReaderOptions](#readeroptions)
+ {boolean} ignore_line_break - 输出结果是否忽略换行符，默认为true 

# ReadLineAsUint8(file, [options])
按行读取一个文件，输出结果为`unsigned 8 bit`类型

### 参数说明
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Extends
+ [BaseReader](./Base.md#basereader)

### 静态方法
+ read(): `ReadLineAsUint8`
+ resume(): `ReadLineAsUint8`
+ pause(): `ReadLineAsUint8`

### 静态属性
+ Type
  - {string} line
  - {string} lines
  
### Simple
```js
import { ReadLineAsUint8 } from 'file-reader'
const Type = ReadLineAsUint8.Type
const target = document.querySelector('#file')
target.onchange = () => {
  const file = target.files[0]
  const reader = new ReadLineAsUint8(file)
  reader.subscribe(
    (record) => {
      const {type, no, size, data} = record   
      if (type === Type.lines) {
        console.log(data.forEach(d => console.log(d)))
      }else if (type ===Type.line) {
        console.log(data, no, size)
      }
    },
    (error, already, read_size) => console.log('onError::', error, already, read_size),
    () => console.log('onCompleted')
  )
  reader.read()
}
```

# ReadLineAsString(file, [options])

### 参数说明
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Extends
+ [BaseReader](./Base.md#basereader)

### 静态方法
+ read(): `ReadLineAsUint8`
+ resume(): `ReadLineAsUint8`
+ pause(): `ReadLineAsUint8`

### 静态属性
+ Type
  - {string} line
  - {string} lines
  
### Simple 参考 [ReadLineAsUint8](#readlineasuint8) 的`example`  


# ReadCsvAsUint8(file, [options])

### 参数说明
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Extends
+ [BaseReader](./Base.md#basereader)

### 静态方法
+ read(): `ReadLineAsUint8`
+ resume(): `ReadLineAsUint8`
+ pause(): `ReadLineAsUint8`


### Simple
```js
import { ReadCsvAsUint8 } from 'file-reader'
const target = document.querySelector('#file')
target.onchange = () => {
  const file = target.files[0]
  const reader = new ReadCsvAsUint8(file)
  reader.subscribe(
    (record) => {
      const { lines, size } = record
      lines.forEach(record => {
        console.log(record.fields, record.size, record.no)
      })
      console.log(size)
    },
    (error, already, read_size) => console.log('onError::', error, already, read_size),
    () => console.log('onCompleted')
  )
  reader.read()
}
```

# ReadCsvWithLines(file, lines, [options])
从第一行开始，读取`file`指定`lines`行，输出结果为通过`utf8`解码后的`string`

### 参数说明
+ {File} file
+ {number} lines - 需要读取多少行
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Extends
+ [BaseReader](./Base.md#basereader)

### 静态方法
+ read(): `ReadLineAsUint8`
+ resume(): `ReadLineAsUint8`
+ pause(): `ReadLineAsUint8`


### Simple
```js
import { ReadCsvWithLines } from 'file-reader'
const target = document.querySelector('#file')
target.onchange = () => {
  const file = target.files[0]
  const reader = new ReadCsvWithLines(file, 100)
  reader.subscribe(
    (record) => {
     const { lines, size } = record
       let total = 0
       lines.forEach(record => {
         console.log('No. %s: %s .%s', record.no, record.fields.toString(), record.size)
       })
       console.log('total => %s, size => %s', total, size)
    },
    (error, already, read_size) => console.log('onError::', error, already, read_size),
    () => console.log('onCompleted')
  )
  reader.read()
}
```






