/**
 * Created by coin on 07/01/2017.
 */

import { JSDOM } from 'jsdom'
import { equal, ok } from 'assert'

const dom = new JSDOM()
global.window = dom.window
const { File } = global.window
const { BrowserFileReader } = require('../../../src/reader/BrowserFileReader')

describe('BrowserFileReader', function () {

  const texts = [
    { str: 'abc', total: 3 },
    { str: '高位字符', total: 8 },
    { str: '!"#$%&*+', total: 8 }
  ]

  // default options
  texts.forEach(desc => {
    it(`.readAsText with default options. [${desc.str}]`, function (done) {
      const file = new File([desc.str], desc.str)
      const reader = new BrowserFileReader(file)
      reader.subscribe(
        ({ data, sequence }) => {
          equal(data, desc.str)
          equal(sequence, 0)
          done()
        }
      )
      reader.readAsText()
    })
  })

  // set chunk_size
  texts.forEach((desc, index) => {
    if (index === 1) return

    it(`.readAsText [${desc.str}] with chunk_size option {chunk_size:1} need ${desc.total} times`, function (done) {
      const file = new File([desc.str], desc.str)
      const reader = new BrowserFileReader(file, { chunk_size: 1 })
      let total = 0
      let ret = ''
      reader.subscribe(
        ({ data }) => {
          ret += data
          total++
        },
        void 0,
        () => {
          equal(ret, desc.str)
          equal(total, desc.total)
          done()
        }
      )

      reader.readAsText()
    })
  })

  // set concurrency
  texts.forEach((desc, index) => {
    if (index === 1) return

    it(`.readAsText [${desc.str}] with concurrency option`, function (done) {
      const file = new File([desc.str], desc.str)
      const reader = new BrowserFileReader(file, { concurrency: 3, chunk_size: 1 })
      let ret = ''
      reader.subscribe(
        ({ data }) => {
          ret += data
        },
        void 0,
        () => {
          equal(ret, desc.str)
          done()
        }
      )
      reader.readAsText()
    })
  })

  // readAsArrayBuffer
  it(`.read() same as .readAsArrayBuffer`, function (done) {
    const desc = texts[0]
    const file = new File([desc.str], desc.str)
    const reader = new BrowserFileReader(file)
    reader.subscribe(({ data }) => {
      equal(data.constructor, ArrayBuffer)
      done()
    })
    reader.read()
  })

  it(`.readAsDataURL will parse content to base64`, function (done) {
    const desc = texts[0]
    const file = new File([desc.str], desc.str)
    const reader = new BrowserFileReader(file)
    reader.subscribe(({ data }) => {
      ok(data.indexOf(Buffer.from(desc.str).toString('base64')) !== -1)
      done()
    })
    reader.readAsDataURL()
  })

})


