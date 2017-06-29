/**
 * Created by coin on 05/01/2017.
 */

import { equal } from 'assert'
import { UCS2Parser } from '../../../src/parser/ucs2'
import { getString, ECODEING } from './util'

describe('UCS2Parser', () => {
  let string, code_points, result
  describe('#ascii code __tests__', () => {
    result = getString(ECODEING.ASCII)
    code_points = UCS2Parser.decode(result.string)
    string = UCS2Parser.encode(result.code_points)
    
    it(`code::${JSON.stringify(result.code_points)} will equal with original code`, () => {
      code_points.forEach((c, i) => {
        equal(c, result.code_points[i])
      })
    })
    
    it(`string:: "${result.string}" will equal original string`, () => {
      equal(string, result.string)
    })
  })
  
  describe('#unicode __tests__', () => {
    result = getString(ECODEING.UNICODE)
    code_points = UCS2Parser.decode(result.string)
    string = UCS2Parser.encode(result.code_points)
    
    it(`code::${JSON.stringify(result.code_points)} will equal with original code`, () => {
      code_points.forEach((c, i) => {
        equal(c, result.code_points[i])
      })
    })
    
    it(`string:: "${result.string}" will equal original string`, () => {
      equal(string, result.string)
    })
  })
})

