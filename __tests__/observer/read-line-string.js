/**
 * Created by coin on 07/01/2017.
 */

import { ReadLineAsString } from '../../src/reader/ReadLineAsString'


const target = document.querySelector('#file')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
let reader

target.onchange = function () {
  const file = target.files[0]
  reader = new ReadLineAsString(file)
  reader.subscribe(
    function (data) {
      let is_line = data.type === ReadLineAsString.Type.line
      if (is_line) {
        console.log('onNext:: No: %s size => %s : %s', data.no, data.data, data.size)
      } else {
        console.log(
          'onNext:: isLines => %s, No: => %s, size => %s, data type = > %s',
          data.type === ReadLineAsString.Type.lines,
          data.no, data.size, typeof data.data
        )
      }
    },
    function (error, already, read_size) {
      console.log('onError::', error, already, read_size)
    },
    function () {
      console.log('onComplete')
    }
  )
  reader.read()
}

pause.onclick = () => {
  reader && reader.pause()
}
resume.onclick = () => {
  reader && reader.resume()
}
