/**
 * Created by coin on 25/09/2017.
 */

import { JSDOM } from 'jsdom'
import { equal, ok } from 'assert'

const dom = new JSDOM()
global.window = dom.window
const { File } = global.window
import  { UTF8Parser } from '../../../src/parser/utf8'
const { ReadLineAsUint8 } = require('../../../src/reader/ReadLineAsUint8')

describe('ReadLineAsUint8', function () {

  const Desc = [
    {
      buf: UTF8Parser.stringToUTF8Uint8('abc'),
      ret: 'abc',
      len: 3
    },
    {
      buf: UTF8Parser.stringToUTF8Uint8('a\r\nb\r\nc\r\n'),
      ret: 'abc',
      len: 3
    },
    {
      buf: UTF8Parser.stringToUTF8Uint8('a\nb\nc'),
      ret: 'abc',
      len: 3
    },
    {
      buf: UTF8Parser.stringToUTF8Uint8('a\nb\nc\n'),
      ret: 'abc',
      len: 4
    },
  ]

  Desc.forEach(desc => {
    it(`ReadLineAsUint8 parse [${desc.buf}] will return ${JSON.stringify(desc.ret)}`, function (done) {
      const reader = new ReadLineAsUint8(new File(desc.buf, 'tt'))
      reader.subscribe(
        ({ data: { data:lines, type, no, size } }) => {
          if (type === ReadLineAsUint8.Type.lines) {
            console.log(lines, type, no, size)
            const ret = lines.map(buf => String.fromCharCode(UTF8Parser.unicodeToUTF8Uint8(buf)))
            console.log(ret)
            equal(no, desc.len)
            done()
          }
        }
      )
      reader.read()
    })
  })

})


