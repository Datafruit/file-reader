/**
 * Created by coin on 25/09/2017.
 */

import { JSDOM } from 'jsdom'
import { equal, ok } from 'assert'

const dom = new JSDOM()
global.window = dom.window
const { File } = global.window
const { ReadLineAsUint8 } = require('../../../src/reader/ReadLineAsUint8')

describe('ReadLineAsUint8', function () {

  const Desc = [
    {
      buf: 'a\nb\nc',
      ret: [97, 98, 99],
      size: [2, 2, 1]
    },
    {
      buf: 'a\r\nb\r\nc\r\n',
      ret: [97, 98, 99],
      size: [3, 3, 3]
    },
    {
      buf: 'a\nb\nc\n',
      ret: [97, 98, 99],
      size: [2, 2, 2]
    }
  ]

  Desc.forEach(desc => {
    it(`ReadLineAsUint8 parse [${JSON.stringify(desc.buf)}] will return ${JSON.stringify(desc.ret)}`, function (done) {
      const file = new File([desc.buf], 'tt')
      const reader = new ReadLineAsUint8(file)

      let lines = []

      reader.subscribe(
        ({ data: record }) => {
          if (record.type === ReadLineAsUint8.Type.line) {
            const { data, no, size } = record
            lines.push(data)
            // unsigned int 8
            equal(data[0], desc.ret[no - 1])
            // buffer size
            equal(size, desc.size[no - 1])
          }
        },
        void 0,
        () => {
          equal(lines.length, desc.ret.length)
          lines.forEach((buf, index) => equal(buf[0], desc.ret[index]))
          done()
        }
      )

      reader.read()
    })
  })

})


