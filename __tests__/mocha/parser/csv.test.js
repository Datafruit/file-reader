/**
 * Created by coin on 05/01/2017.
 */

import { equal, ok } from 'assert'
import { CSVParser } from '../../../src/parser/csv'
import { UTF8Parser } from '../../../src/parser/utf8'

describe('CSVParser', () => {
  describe('.parse', () => {
    // 'a,"first,second",b' => ['a', 'first,second', 'b']
    describe('with quotation', function () {
      const cvs_parser = new CSVParser()
      let str = 'a,"first,second",b'
      let result = ['a', 'first,second', 'b']
      it(`parse '${str}' should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse(UTF8Parser.stringToUTF8Uint8(str))
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

    // ,,, => ['', '', '', '']
    describe('all field is empty', function () {
      const cvs_parser = new CSVParser()
      let str = ',,,'
      let result = ['', '', '', '']
      it(`parse '${str}' should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse(UTF8Parser.stringToUTF8Uint8(str))
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

    // 'a,b,' => ['a', 'b', '']
    describe('empty field', function () {
      const cvs_parser = new CSVParser()
      let str = 'a,b,'
      let result = ['a', 'b', '']
      it(`parse '${str}' should equal ${JSON.stringify(result)}`, function (done) {
        const buf = UTF8Parser.stringToUTF8Uint8(str)
        const ret = cvs_parser.parse(buf)
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

    // 1,"2\n3\n4",5 => ['1', '2\n3\n4', '5']
    describe('multiple lines', function () {
      const parser = new CSVParser()
      const str = `1,"2\n3\n4",5`
      const result = ['1', '2\n3\n4', '5']
      it(`parse '${str}' should equal ${JSON.stringify(result)}'`, function (done) {
        const ret = parser.parse(UTF8Parser.stringToUTF8Uint8(str))
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
      it(`parse '${str}' should equal ${JSON.stringify(result)}`, function (done) {
        const ret = cvs_parser.parse(UTF8Parser.stringToUTF8Uint8(str))
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

    // '1,"2,3' => error
    describe('Should throw error when format error', function () {
      const parser = new CSVParser()
      const str = '1,"2,3'

      it(`parse '${str}' will catch a error`, function () {
        let error = null
        try {
          parser.parse(UTF8Parser.stringToUTF8Uint8(str))
        } catch (e) {
          console.log(e.message)
          error = e
        }
        ok(error !== null)
      })
    })
  })

})

