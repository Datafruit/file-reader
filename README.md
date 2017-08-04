[![Build Status](https://travis-ci.org/Datafruit/file-reader.svg?branch=master)](https://travis-ci.org/Datafruit/file-reader)

[中文](./docs/index.md)

# About
The `FileReader` class provides native file-reading 
capabilities for modern browsers.

Sometimes we will read out the needs from large files.
such as read a part of the text file to display on the browser.
At this point need to read the file as fragmented to avoid the browser stuck.

`FileReader` is an asynchronous interface, 
so in the concurrent read need a program to manage these concurrent,
pass the contents of the slices to the next operation with order.

You can wait for a slice finished then reading the next piece.
because `JavaScript` is a single-threaded language, so the two ways not
essentially different.

# Install
```bash
npm install next-reader --save-dev
```

# Reader
All Reader extends of [BaseReader](#basereader)
- [BrowserFileReader(file [,options])](#browserfilereader)
- [ReadLineAsUint8(file [,options])](#readlineasuint8)
- [ReadLineAsString(file [,options])](#readlineasstring)
- [ReadCsvAsUint8(file [,options])](#readcsvasuint8)
- [ReadCsvWithLines(file, lines, [,options])](#readcsvwithlines)

# ReaderOptions
+ {String} encode - default `utf8`
+ {Number} read_size - default `file.size`
+ {Number} concurrency - default `1`
+ {Number} chunk_size - file's encode. default `utf8`, only support`utf8`，default `1 << 16`

# BrowserFileReader(file, [options])

### Params
+ {File} file
+ {[ReaderOptions](#readeroptions)} [options]

### Simple
```js
import { BrowserFileReader } from 'next-reader'
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
+ {Boolean} ignore_line_break - default `true`

# ReadLineAsUint8(file, [options])
### Params
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Simple
```js
import { ReadLineAsUint8 } from 'next-reader'
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

### Params
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

Simple is same as [ReadLineAsUint8](#readlineasuint8)

# ReadCsvAsUint8(file, [options])

### Params
+ {File} file
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Simple
```js
import { ReadCsvAsUint8 } from 'next-reader'
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

### Params
+ {File} file
+ {Number} lines - lines to read
+ {[LineReaderOptions](#linereaderoptions)} [options]

### Simple
```js
import { ReadCsvWithLines } from 'next-reader'
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

# BaseReader
BaseReader extends of 
[BaseObservable](#baseobservable) 
and implements 
[AbstractReader](#abstractreader)

# AbstractReader 
Implements [AbstractObservable](#abstractobservable)
- read()
- pause()
- resume()
- enqueue()
- onReadData()
- onReadError(error, already, read_size)
- onReadComplete()
- readable()
- validate(data)
- result(data)

# BaseObservable
Implements of [AbstractObservable](#abstractobservable)

# AbstractObservable
- subscribe([BaseObserver](#baseobserver)OrOnNext, onError, onComplete)
- subscribeOnNext(...args)
- subscribeOnError(...args)
- subscribeOnComplete(...args)

# BaseObserver 
Implements [AbstractObserver](#abstractobserver)

# AbstractObserver
- onNext(...args)
- onError(...args)
- onComplete(...args)
- destroy()
- isDestroy()

# License
MIT
