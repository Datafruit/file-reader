/**
 * Created by coin on 07/01/2017.
 */

import { ReadLineAsUint8 } from '../../src/reader/ReadLineAsUint8'

const target = document.querySelector('#file')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
let reader

target.onchange = function () {
  const file = target.files[0]
  reader = new ReadLineAsUint8(file)
  reader.subscribe(
    function (data) {
      
      console.log(
        'onNext:: isLines => %s, No: => %s, size => %s, data type = > %s',
        data.type === ReadLineAsUint8.Type.lines,
        data.no, data.size, typeof data.data
      )
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

pause.onclick = () => { reader && reader.pause()}
resume.onclick = () => {reader && reader.resume()}