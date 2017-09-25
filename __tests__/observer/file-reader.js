/**
 * Created by coin on 06/01/2017.
 */

import { BrowserFileReader } from '../../src/reader/BrowserFileReader'

const target = document.querySelector('#file')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')

let reader

target.onchange = () => {
  const file = target.files[0]
  reader = new BrowserFileReader(file)
  const mark = `csv.size.is.${file.size / (1 << 20)}MB`

  reader.subscribe(
    ({ data, sequence }) => {
      console.log('onNext::', data, sequence)
    },
    ({ error, already, read_size }) => console.log('onError::', error, already, read_size),
    () => console.timeEnd(mark)
  )

  console.time(mark)
  reader.readAsDataURL()
}

pause.onclick = () => { reader && reader.pause()}
resume.onclick = () => {reader && reader.resume()}
