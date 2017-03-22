/**
 * Created by coin on 05/01/2017.
 */

import { equal } from 'assert'
import { CSVParser } from '../../../src/parser/csv'
import { UTF8Parser } from '../../../src/parser/utf8'
import { getString, ECODEING, toString, typeArrayToArray } from './util'

describe('CSVParser', () => {
  describe('.parse_line', () => {
    describe('#ascii code', () => {
      const parser = new UTF8Parser()
      const cvs_parser = new CSVParser()
      const result = getString(ECODEING.ASCII)
      result.code_points = result.code_points.filter(code => code !== 34)
      result.string = result.string.replace(/"/g, '')
      const list = result.code_points.map(p => toString([p]))
      const string = list.join(',')
      const utf8 = UTF8Parser.string_to_utf8_uint8(string)
      const length = result.code_points.length
      const line = cvs_parser.parse_line(utf8)
      const line_string = typeArrayToArray(line)
      .map(array => toString(parser.entry(array).character))
      
      it(`string code::
          ${JSON.stringify(result.code_points)}
          string:: 
          ${result.string} 
          to csv string::
          ${string}
          to utf8::
          ${JSON.stringify(typeArrayToArray(utf8))}
          to csv line::
          ${JSON.stringify(typeArrayToArray(line).map(array => typeArrayToArray(array)))}
          get lines::
          ${JSON.stringify(line_string)} length equal csv string length`, () => {
        equal(line_string.length, line.length)
      })
    })
    
    describe('#unicode code', () => {
      const parser = new UTF8Parser()
      const cvs_parser = new CSVParser()
      const result = getString(ECODEING.UNICODE)
      result.code_points = result.code_points.filter(code => code !== 34)
      result.string = result.string.replace(/"/g, '')
      const list = result.code_points.map(p => toString([p]))
      const string = list.join(',')
      const utf8 = UTF8Parser.string_to_utf8_uint8(string)
      const length = result.code_points.length
      const line = cvs_parser.parse_line(utf8)
      const line_string = typeArrayToArray(line)
      .map(array => toString(parser.entry(array).character))
      
      it(`string code::
          ${JSON.stringify(result.code_points)}
          string:: 
          ${result.string} 
          to csv string::
          ${string}
          to utf8::
          ${JSON.stringify(typeArrayToArray(utf8))}
          to csv line::
          ${JSON.stringify(typeArrayToArray(line)
      .map(array => typeArrayToArray(array)))}
          get lines::
          ${JSON.stringify(line_string)} length equal csv string length`, () => {
        equal(line_string.length, line.length)
      })
    })
    
    describe('#empty element', () => {
      const cvs_parser = new CSVParser()
      const array = new Array(10).fill(0x2C)
      const code = cvs_parser.parse_line(new Uint8Array(array))
      it(`empty array::
        ${JSON.stringify(array)}
        toString::
        ${toString(array)}
        parse to base64 line::
        ${JSON.stringify(code)}
        length will equal array.length + 1`, () => {
        equal(code.length, array.length + 1)
      })
    })
  })
})

