/**
 * Created by coin on 05/01/2017.
 */

import { equal, ok } from 'assert'
import { CSVParser } from '../../../src/parser/csv'
import { UTF8Parser } from '../../../src/parser/utf8'

describe('CSVParser', function () {
  const parser = new CSVParser()

  const desc = [
    {
      str: 'a,"first,second",b',
      ret: ['a', 'first,second', 'b']
    },
    {
      str: 'a,"first"before,after"second",b',
      ret: ['a', 'first"before,after"second', 'b']
    },
    {
      str: ',,,',
      ret: ['', '', '', '']
    },
    {
      str: 'a,b,c',
      ret: ['a', 'b', 'c']
    },
    {
      str: 'a,,c',
      ret: ['a', '', 'c']
    },
    {
      str: 'a,"b\nc\nd",e',
      ret: ['a', 'b\nc\nd', 'e']
    }
  ]

  desc.forEach(function (d) {
    it(`parse(${d.str}) will return ${JSON.stringify(d.ret)}`, function () {
      const ret = parser.parse(UTF8Parser.stringToUTF8Uint8(d.str))
      const arr = ret.map(function (r) {
        return String.fromCodePoint.apply(null, r)
      })
      console.log(arr)
      equal(JSON.stringify(d.ret), JSON.stringify(arr))
    })
  })

  const illegal_str = 'a,"b,c'
  it(`parse(${illegal_str}) will throw a error`, function () {

    let error = null
    try {
      parser.parse(UTF8Parser.stringToUTF8Uint8(illegal_str))
    } catch (e) {
      console.log(e.message)
      error = e
    }
    ok(error !== null)
  })
})


