// Definitions by: Coinxu <https://github.com/CoinXu>
// TypeScript Version: 2.4

export = Reader
export as namespace Reader

declare namespace Reader {

  export interface Utils {
    random (min: number, max: number): number

    random_str (total: number): string
    gen_short_id (pre_fix_len?: number): () => string

    short_id (): string

    isFunction (arg: any): boolean

    isObject (arg: any): boolean

    identify<T> (arg: T): T

    noop (...args: any[]): void

    inherits (child: any, parent: any): void

    arrayLikeToArray<T> (arg: ArrayLike<T>): T[]

    typeArrayToArray<T> (array: T[][]): T[]
  }

  /** ============================
   *   Utils
   ** ============================
   */
  export function notImplemented (name: string): () => never

  export function dynamic_uint8_array (size: number): {
    push(...args: Array<number[] | Uint8Array>): number
    get(): Uint8Array
  }

  // ----------------------------
  // CsvCompleteLine
  //
  export class CsvCompleteLine {
    constructor (quotation?: number, separator?: number)

    private quotation: number
    private separator: number
    private cache: Uint8Array

    press (line: Uint8Array): Uint8Array
  }

  // ----------------------------
  // Queue
  //
  export class Queue<T> {
    constructor (max_queue: number)

    private _queue: T[]
    private _point: number
    private _total: number
    private _max_queue: number

    reset (queue: T[]): Queue<T>

    queue (data: T): Queue<T>

    dequeue (): T | null

    full (): boolean

    undequeued (): number

    done (): boolean

    forEach (fn: (data: T | null) => void): Queue<T>

    rollback (): number

    forward (): number
  }

  // ----------------------------
  // Scheduler
  //

  export class Scheduler<T> {
    constructor (max_tasks: number)

    private max_tasks: number
    private buffer: T[]
    private subscribers: Array<(arg: T) => any>
    private scheduled: T[]

    subscribe (fn: (arg: T) => any): Scheduler<T>

    entry (data: T): Scheduler<T>

    release (data: T): Scheduler<T>

    dispose (): Scheduler<T>

    reEntry (data: T): Scheduler<T>

    right (): boolean

    drain (): boolean

    overflowed (): boolean

    accomplish (): boolean
  }

  /** ============================
   *   Base
   ** ============================
   */
  interface OnNext<T> {
    (arg: T): any
  }

  interface OnError<T> {
    (err: T): any
  }

  interface OnComplete {
    (): any
  }

  // ----------------------------
  // Observer
  //
  class Observer<T, E> {
    constructor (onNext?: OnNext<T>, onError?: OnError<E>, onComplete?: OnComplete)

    readonly prototype: Observer<T, E>
    private destroyed: boolean
    private next: OnNext<T>
    private error: OnError<E>
    private complete: OnComplete

    onNext (data: T): Observer<T, E>

    onError (err: E): Observer<T, E>

    onComplete (): Observer<T, E>

    destroy (): Observer<T, E>

    isDestroy (): boolean

    static isObserver (arg: any): boolean
  }

  // ----------------------------
  // Observable
  //
  class Observable<T, E> {
    constructor ()

    private observer: Observer<T, E>
    readonly prototype: Observer<T, E>

    subscribe (observerOrOnNext: Observer<T, E> | OnNext<T>,
      onError: OnError<E>,
      onComplete: OnComplete): Observable<T, E>

    subscribeOnNext (data: T): Observable<T, E>

    subscribeOnError (err: E): Observable<T, E>

    subscribeOnComplete (): Observable<T, E>
  }

  /** ============================
   *   Parser
   ** ============================
   */

  interface UTF8ParserStruct {
    character: number[]
    byteLength: number
  }

  // ----------------------------
  // UCS2Parser
  //
  export class UCS2Parser {
    static decode (str: string): number[]

    static encode (array: number[]): string
  }

  // ----------------------------
  // UTF8Parser
  //
  export class UTF8Parser {
    constructor ()

    private prev_buffer: Uint8Array | null
    private bytes: number
    private parser: UCS2Parser

    parse (arr: Uint8Array): UTF8ParserStruct

    entry (arr: Uint8Array): UTF8ParserStruct | UTF8Parser

    filterOutBOM (arr: Uint8Array): {point: number, array: Uint8Array}

    done (): boolean

    static get_point (bytes: Uint8Array, len: number): number

    static unicode_to_utf8_uint8 (array: number[]): Uint8Array

    static string_to_utf8_uint8 (str: string): Uint8Array
  }

  // ----------------------------
  // CSVParser
  //
  export class CSVParser {
    constructor (separator?: number, quotation?: number)

    parse_line (array: Uint8Array): Uint8Array[]
  }

  // ----------------------------
  // Base64Parser
  //
  export class Base64Parser {
    constructor ()

    private code: string

    encode (buffer: Uint8Array): string
  }

  /**
   * ====================
   * Reader
   * ====================
   */
  interface ReaderStruct<T> {
    data: T
    sequence: number
  }
  class Reader<T, E> extends Observable<ReaderStruct<T>, E> {
    private _readable: boolean
    private queue: Queue<ReaderStruct<T>>
    private chunks: number

    read (): Reader<ReaderStruct<T>, E>

    pause (): Reader<ReaderStruct<T>, E>

    resume (): Reader<ReaderStruct<T>, E>

    readable (): Reader<ReaderStruct<T>, E>

    enqueue (data: ReaderStruct<T>): Reader<ReaderStruct<T>, E>

    onReadData (): Reader<ReaderStruct<T>, E>

    onReadError (err: E): Reader<ReaderStruct<T>, E>

    onReadComplete (): Reader<ReaderStruct<T>, E>

    validate (data: ReaderStruct<T>, sequence: number): boolean

    result (data: ReaderStruct<T>, sequence: number): any

    isLastSnippet (data: ReaderStruct<T>, sequence: number): boolean
  }

  /**
   * ====================
   * export Base Class
   * ====================
   */
  export class BaseObserver<T, E> extends Observer<T, E> {

  }
  export class BaseObservable<T, E> extends Observable<T, E> {

  }
  export class BaseReader<T, E> extends Reader<T, E> {

  }

  /**
   * ====================
   * BrowserFileReader
   * ====================
   */
  interface ReaderOptions {
    encode?: string      // default 'utf8'
    read_size?: number   // default 0
    chunk_size?: number  // default 1 << 16
    concurrency: number  // default 1
  }

  interface BrowserFileReaderOptions extends ReaderOptions {}

  type BrowserFileReaderType = 'Text' | 'ArrayBuffer' | 'DataURL'

  interface BrowserFileReaderStruct {
    reader: FileReader
    start: number
    end: number
  }
  export class BrowserFileReader<E> extends BaseReader<BrowserFileReaderStruct, E> {
    constructor (file: File, options?: BrowserFileReaderOptions)

    private options: BrowserFileReaderOptions
    private file: File
    private already: number
    private readType: string

    private _setting (type: BrowserFileReaderType): BrowserFileReader<E>

    private _read (): BrowserFileReader<E>

    private _next (): BrowserFileReader<E>

    private _slice (): BrowserFileReader<E>

    private _onReadError (): BrowserFileReader<E>

    private _onReadData (): BrowserFileReader<E>

    readAsText (): BrowserFileReader<E>

    readAsArrayBuffer (): BrowserFileReader<E>

    readAsDataURL (): BrowserFileReader<E>
  }

  /**
   * ====================
   * ReadLineAsUint8
   * ====================
   */

  interface LineReaderOptions extends ReaderOptions {
    ignore_line_break?: boolean // default true
  }

  export interface ReadLineType {
    readonly line: string
    readonly lines: string
  }

  interface LineRecordStruct {
    line: number[],
    size: number
  }

  interface ReadLineStruct {
    type: string
    data: LineRecordStruct[]
    no: number
    size: number
  }

  export class ReadLineAsUint8<E> extends BaseReader<ReadLineStruct, E> {
    constructor (file: File, options?: LineReaderOptions)

    private options: LineReaderOptions
    private file: File
    private reader: BrowserFileReader<E>
    private cache: number[]
    private total_lines: number

    private _listen (): ReadLineAsUint8<E>

    private _receive (array_buffer: ArrayBuffer): ReadLineAsUint8<E>

    private _concat (array_buffer: ArrayBuffer): Uint8Array | null

    private _ignore_line_break (array: Uint8Array): LineRecordStruct[]

    private _normal_receive (array: Uint8Array): LineRecordStruct[]

    private _send_lines (lines: LineRecordStruct[]): ReadLineAsUint8<E>

    static Type: ReadLineType
  }

  /**
   * ====================
   * ReadLineAsString
   * ====================
   */

  export class ReadLineAsString<E> extends BaseReader<ReadLineStruct, E> {
    constructor (file: File, options?: LineReaderOptions)

    private file: File
    private options: LineReaderOptions
    private reader: ReadLineAsUint8<E>
    private utf8_parser: UTF8Parser

    private _listen (): ReadLineAsString<E>

    private _receive (lines: LineRecordStruct[], no: number, size: number): ReadLineAsString<E>
  }

  /**
   * ====================
   * ReadCsvAsUint8
   * ====================
   */

  export class ReadCsvAsUint8<E> extends BaseReader<ReadLineStruct, E> {
    constructor (file: File, options?: LineReaderOptions)

    private file: File
    private options: LineReaderOptions
    private reader: ReadLineAsUint8<E>
    private csv_parser: CSVParser
    private utf8_parser: UTF8Parser
    private checker: CsvCompleteLine
    private count: 0

    _listen (): ReadCsvAsUint8<E>

    _onNext (record: ReadLineStruct): ReadCsvAsUint8<E>
  }

  /**
   * ====================
   * ReadCsvWithLines
   * ====================
   */

  export class ReadCsvWithLines<E> extends BaseReader<ReadLineStruct, E> {
    constructor (file: File, lines: number, options?: LineReaderOptions)

    private file: File
    private total: number
    private already: number
    private reader: ReadCsvAsUint8<E>
    private utf8_parser: UTF8Parser

    private _listen (): ReadCsvWithLines<E>

    private _receive (record: ReadLineStruct): ReadCsvWithLines<E>
  }

  export const utils: Utils
}
