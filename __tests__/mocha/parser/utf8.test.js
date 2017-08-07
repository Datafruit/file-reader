/**
 * Created by coin on 05/01/2017.
 */

import { equal, ok } from 'assert'
import { UTF8Parser } from '../../../src/parser/utf8'
import { getString, ECODEING, toString, typeArrayToArray} from './util'

const BOM = [0x00ef, 0x00bb, 0x00bf]

describe('UTF8Parer', () => {
  describe('.entry', ()=> {
    const parser = new UTF8Parser()
    parser.bytes = 3
    let string, code_points, result, parser_result, with_bom
    
    describe('#ascii code with BOM', () => {
      result = getString(ECODEING.ASCII)
      with_bom = BOM.concat(result.code_points)
      parser_result = parser.entry(with_bom)
      code_points = parser_result.character
      string = toString(code_points)
      
      it(`origin code:: ${JSON.stringify(with_bom)} discard 
          BOM::${JSON.stringify(BOM)}
          result::${JSON.stringify(code_points)}`, () => {
        BOM.forEach(n =>equal(code_points.indexOf(n), -1))
      })
      
      it(`string:: "${result.string}" will equal original string`, () => {
        equal(string, result.string)
      })
    })
    
    describe('#ascii code without BOM', () => {
      result = getString(ECODEING.ASCII)
      parser_result = parser.entry(result.code_points)
      code_points = parser_result.character
      string = toString(code_points)
      
      it(`origin code:: ${JSON.stringify(result.code_points)} will equal 
          result:: ${JSON.stringify(code_points)}`, () => {
        result.code_points.forEach(n =>ok(code_points.indexOf(n) !== -1))
      })
      
      it(`string:: "${result.string}" will equal original string`, () => {
        equal(string, result.string)
      })
    })
  })
  
  describe('.unicodeToUTF8Uint8', () => {
    let result = getString(ECODEING.UNICODE)
    let utf8 = UTF8Parser.unicodeToUTF8Uint8(result.code_points)
    const min = 0, max = 0b11111111
    
    it(`#unicode code:: ${JSON.stringify(result.code_points)} 
        to utf8:: ${JSON.stringify(utf8)} 
        will between ${min} and ${max}`, () => {
      utf8.forEach(n => ok(n >= min && n < max))
    })
  })
  
  describe('.stringToUTF8UInt8', () => {
    const min = 0, max = 0b11111111
    
    let result = getString(ECODEING.UNICODE)
    let utf8_code = UTF8Parser.stringToUTF8UInt8(result.string)
    let array = typeArrayToArray(utf8_code)
    let parser = new UTF8Parser()
    // 不忽略BOM
    parser.bytes = 3
    let parse_array = parser.entry(utf8_code).character
    let parse_string = toString(parse_array)
    
    it(`code:: ${result.code_points}
        to string:: ${result.string} 
        to utf8 code:: ${JSON.stringify(array)} 
        will between ${min} and ${max}. then the 
        code::${JSON.stringify(parse_array)} 
        can to be
        string:: ${parse_string} that equal
        original string:: ${result.string}`, () => {
  
      array.forEach(n => ok(n >= min && n < max))
      equal(parse_string, result.string)
    })
  })
})

