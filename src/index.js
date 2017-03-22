/**
 * Created by coin on 18/12/2016.
 */

import { BrowserFileReader } from './reader/BrowserFileReader'
import { ReadCsvAsUint8 } from './reader/ReadCsvAsUint8'
import { ReadLineAsUint8 } from './reader/ReadLineAsUint8'
import { ReadLineAsString } from './reader/ReadLineAsString'
import { ReadCsvWithLines } from './reader/ReadCsvWithLines'

import { UTF8Parser } from './parser/utf8'
import { CSVParser } from './parser/csv'
import { UCS2Parer } from './parser/ucs2'
import { Base64Parser } from './parser/base64'

const Parser = {
  UTF8Parser,
  CSVParser,
  UCS2Parer,
  Base64Parser
}

export {
  BrowserFileReader,
  ReadCsvAsUint8,
  ReadLineAsUint8,
  ReadLineAsString,
  ReadCsvWithLines,
  Parser
}