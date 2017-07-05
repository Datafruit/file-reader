import {
  utils,

  notImplemented,
  dynamic_uint8_array,
  CsvCompleteLine,
  Queue,
  Scheduler,

  Observer,
  Observable,

  UTF8Parser,
  UCS2Parser,
  CSVParser,
  Base64Parser,

  BrowserFileReader,
  ReadLineAsUint8,
  ReadLineAsString,
  ReadLineAsUint8,
  ReadCsvWithLines
} from './index'

let num: number
let str: string
let bool: boolean

// ====================
// utils
// ====================
num = utils.random(0, 1)
str = utils.random_str(1)
str = utils.gen_short_id()()
str = utils.short_id()
bool = utils.isFunction({})
bool = utils.isObject({})

num = utils.identify<number>(1)
str = utils.identify<string>('1')
bool = utils.identify<boolean>(!0)

utils.noop(1, 2, 3)
utils.inherits(1, 2)
utils.arrayLikeToArray([1, 2]).length
utils.arrayLikeToArray({length: 1}).length
utils.typeArrayToArray([[1, 2]]).length

notImplemented('123')
const que = dynamic_uint8_array(100)
que.push([1], [2], new Uint8Array(0))
que.get().byteLength

// ====================
// CsvCompleteLine
// ====================
const cll = new CsvCompleteLine(1, 2)
console.log(
  cll.cache,
  cll.quotation,
  cll.separator
)
cll.press(new Uint8Array(0))

// ====================
// Queue
// ====================
const queue = new Queue<number>(10)
console.log(
  queue._queue,
  queue._point,
  queue._total,
  queue._max_queue
)
queue.reset([1])
queue.queue(1)

bool = queue.full()
num = queue.undequeued()
bool = queue.done()
queue.forEach((n: number) => console.log(1 + n))
num = queue.rollback()
num = queue.forward()

// ====================
// Scheduler
// ====================
const sche = new Scheduler<string>(10)
console.log(
  sche.max_tasks,
  sche.buffer,
  sche.subscribers,
  sche.scheduled
)

sche.subscribe((s: string) => console.log(s))
sche.entry('s')
sche.release('s')
bool = sche.dispose().tight()
bool = sche.reEntry('s').drain()
bool = sche.overflowed()
bool = sche.accomplish()


// ====================
// Observer
// ====================
// TODO
