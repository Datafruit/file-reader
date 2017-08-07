/**
 * Created by coin on 05/01/2017.
 */

import { ok } from 'assert'
import { Base64Parser } from '../../../src/parser/base64'
import { UTF8Parser } from '../../../src/parser/utf8'
import { getString, ECODEING } from './util'

describe('Base64Parer', () => {
  describe('.encode', () => {
    const parser = new Base64Parser()
    const codes = parser.code + '='
    describe('#ascii code', () => {
      let result = getString(ECODEING.ASCII)
      let utf8_code = UTF8Parser.unicodeToUTF8Uint8(result.code_points)
      let array = utf8_code.reduce((p, c) => p.concat(c), [])
      let code = parser.encode(utf8_code)
      
      it(`string ::
          ${result.string}
          base64 code:: 
          ${code}
          to utf8:: 
          ${JSON.stringify(array)}
          all in ::
          ${codes} `, () => {
        for (let i = 0; i < code.length; i++) {
          ok(codes.indexOf(code[i]) !== -1)
        }
      })
    })
    
    describe('#unicode code', () => {
      let result = getString(ECODEING.UNICODE)
      let utf8_code = UTF8Parser.unicodeToUTF8Uint8(result.code_points)
      let array = utf8_code.reduce((p, c) => p.concat(c), [])
      let code = parser.encode(utf8_code)
      
      it(`string ::
          ${result.string}
          base64 code:: 
          ${code}
          to utf8:: 
          ${JSON.stringify(array)}
          all in ::
          ${codes}`, () => {
        for (let i = 0; i < code.length; i++) {
          ok(codes.indexOf(code[i]) !== -1)
        }
      })
    })
    
  })
})

