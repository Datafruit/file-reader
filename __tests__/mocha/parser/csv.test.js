/**
 * Created by coin on 05/01/2017.
 */

import { equal } from 'assert'
import { CSVParser } from '../../../src/parser/csv'
import { UTF8Parser } from '../../../src/parser/utf8'

describe('CSVParser', () => {
  describe('.parse_line', () => {
    describe('with quotation', function () {
      const cvs_parser = new CSVParser()
      let str = 'a,"first,second",b'
      let result = ['a', 'first,second', 'b']
      it(`parse [${str}] should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse_line(UTF8Parser.string_to_utf8_uint8(str))
        equal(ret.length, result.length)
        ret.forEach(function (v, i) {
          equal(
            String.fromCharCode.apply(String, v),
            result[i]
          )
        })
        done()
      })
    })

    describe('all field is empty', function () {
      const cvs_parser = new CSVParser()
      let str = ',,,'
      let result = ['', '', '', '']
      it(`parse [${str}] should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse_line(UTF8Parser.string_to_utf8_uint8(str))
        equal(ret.length, result.length)
        ret.forEach(function (v, i) {
          equal(
            String.fromCharCode.apply(String, v),
            result[i]
          )
        })
        done()
      })
    })

    describe('empty field', function () {
      const cvs_parser = new CSVParser()
      let str = 'a,b,'
      let result = ['a', 'b', '']
      it(`parse [${str}] should equal ${JSON.stringify(result)}`, function (done) {
        const buf = UTF8Parser.string_to_utf8_uint8(str)
        console.log('buf =>', buf)
        const ret = cvs_parser.parse_line(buf)
        console.log('ret', JSON.stringify(ret))
        equal(ret.length, result.length)
        ret.forEach(function (v, i) {
          equal(
            String.fromCharCode.apply(String, v),
            result[i]
          )
        })
        done()
      })
    })

    describe('complex', function () {
      const cvs_parser = new CSVParser()
      const str = 'a,b,"c,d",,,,e,f,,,,j'
      const result = ['a', 'b', 'c,d', '', '', '', 'e', 'f', '', '', '', 'j']
      it(`parse [${str}] should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse_line(UTF8Parser.string_to_utf8_uint8(str))
        equal(ret.length, result.length)
        ret.forEach(function (v, i) {
          equal(
            String.fromCharCode.apply(String, v),
            result[i]
          )
        })
        done()
      })
    })
  })
})

