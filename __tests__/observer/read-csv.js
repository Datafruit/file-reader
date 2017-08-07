/**
 * Created by coin on 07/01/2017.
 */

import { ReadCsvAsUint8 } from '../../src/reader/ReadCsvAsUint8'
import { UTF8Parser } from '../../src/parser/utf8'

const target = document.querySelector('#file')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
let reader

target.onchange = function () {
  const file = target.files[0]
  reader = new ReadCsvAsUint8(file)
  const parser = new UTF8Parser()
  const mark = `csv.size.is.${file.size / (1 << 20)}MB`

  reader.subscribe(
    function (record) {
      const { lines, size } = record
      let total = 0

      lines.forEach(record => {
        const string_array = record.fields.map(field => {
          return String.fromCodePoint.apply(String, parser.parse(field).character)
        })

        console.log('No:%s', record.no, string_array, record.size)
        total += record.size
      })

      console.log('total => %s, size => %s', total, size)
    },
    function (error, already, read_size) {
      console.log('onError::', error, already, read_size)
    },
    function () {
      console.log('onComplete')
      console.timeEnd(mark)
    }
  )
  console.time(mark)
  reader.read()
}

pause.onclick = () => {
  reader && reader.pause()
}
resume.onclick = () => {
  reader && reader.resume()
}