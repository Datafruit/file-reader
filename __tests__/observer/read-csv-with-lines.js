/**
 * Created on 11/03/2017.
 */

import { ReadCsvWithLines } from '../../src/reader/ReadCsvWithLines'
const input = document.querySelector('#file')

input.onchange = function () {
  const file = input.files[0]
  const reader = new ReadCsvWithLines(file, 100)
  const mark = `csv.size.is.${file.size / (1 << 20)}MB`
  
  reader.subscribe(
    function (record) {
      const { lines, size } = record
      let total = 0
      lines.forEach(record => {
        const { fields, no, size } = record
        console.log('No. %s: %s .%s', no, fields.toString(), size)
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