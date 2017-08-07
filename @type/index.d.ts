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

  export const utils: Utils

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
  interface CsvCompleteLine {

    readonly quotation: number
    readonly separator: number
    readonly cache: Uint8Array

    press (line: Uint8Array): Uint8Array
  }

  interface CsvCompleteLineConstructor {
    new(quotation?: number, separator?: number): CsvCompleteLine
  }

  export const CsvCompleteLine: CsvCompleteLineConstructor

  // ----------------------------
  // Queue
  //
  interface Queue<T> {

    readonly _queue: T[]
    readonly _point: number
    readonly _total: number
    readonly _max_queue: number

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

  interface QueueConstructor {
    new<T>(max_queue: number): Queue<T>
  }

  export const Queue: QueueConstructor

  // ----------------------------
  // Scheduler
  //
  interface Scheduler<T> {
    readonly max_tasks: number
    readonly buffer: T[]
    readonly subscribers: Array<(arg: T) => any>
    readonly scheduled: T[]

    subscribe (fn: (arg: T) => any): Scheduler<T>
    entry (data: T): Scheduler<T>
    release (data: T): Scheduler<T>
    dispose (): Scheduler<T>
    reEntry (data: T): Scheduler<T>
    tight (): boolean
    drain (): boolean
    overflowed (): boolean
    accomplish (): boolean
  }

  interface SchedulerConstructor {
    new<T>(max_tasks: number): Scheduler<T>
  }

  export const Scheduler: SchedulerConstructor

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
  interface Observer<T, E> {
    readonly destroyed: boolean
    readonly next: OnNext<T>
    readonly error: OnError<E>
    readonly complete: OnComplete

    onNext (data: T): Observer<T, E>
    onError (err: E): Observer<T, E>
    onComplete (): Observer<T, E>
    destroy (): Observer<T, E>
    isDestroy (): boolean
  }

  interface ObserverConstructor {
    new<T, E> (): Observable<T, E>
  }

  export const Observer: ObserverConstructor

  interface ObserverConstructor {
    new<T, E> (onNext?: OnNext<T>,
      onError?: OnError<E>,
      onComplete?: OnComplete): Observable<E, E>
    isObserver (arg: any): boolean
  }

  export const Observer: ObserverConstructor

  // ----------------------------
  // Observable
  //
  interface Observable<T, E> {
    readonly observer: Observer<T, E>
    readonly prototype: Observer<T, E>

    subscribe (observerOrOnNext: Observer<T, E> | OnNext<T>,
      onError?: OnError<E>,
      onComplete?: OnComplete): Observable<T, E>
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
  export interface UCS2Parser {
    decode (str: string): number[]
    encode (array: number[]): string
  }

  // ----------------------------
  // UTF8Parser
  //
  interface UTF8Parser {
    readonly prev_buffer: Uint8Array | null
    readonly bytes: number
    readonly parser: UCS2Parser

    parse (arr: Uint8Array): UTF8ParserStruct
    entry (arr: Uint8Array): UTF8ParserStruct | UTF8Parser
    filterOutBOM (arr: Uint8Array): { point: number, array: Uint8Array }
    done (): boolean
  }

  interface UTF8ParserConstructor {
    new(): UTF8Parser
    get_point (bytes: Uint8Array, len: number): number
    unicodeToUTF8Uint8 (array: number[]): Uint8Array
    stringToUTF8UInt8 (str: string): Uint8Array
  }

  export const UTF8Parser: UTF8ParserConstructor

  // ----------------------------
  // CSVParser
  //
  interface CSVParser {
    readonly separator: number
    readonly quotation: number
    parse (array: Uint8Array): Uint8Array[]
  }

  interface CSVParserConstructor {
    new (separator?: number, quotation?: number): CSVParser
  }

  export const CSVParser: CSVParserConstructor

  // ----------------------------
  // Base64Parser
  //
  interface Base64Parser {
    readonly code: string
    encode (buffer: Uint8Array): string
  }

  interface Base64ParserConstructor {
    new(): Base64Parser
  }

  export const Base64Parser: Base64ParserConstructor

  /**
   * ====================
   * Reader
   * ====================
   */
  interface ReaderStruct<T> {
    data: T
    sequence: number
  }

  interface Reader<T, E> extends Observable<ReaderStruct<T>, E> {
    readonly _readable: boolean
    readonly queue: Queue<ReaderStruct<T>>
    readonly chunks: number

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

  interface BaseObserverConstructor {
    new<T, E>(): Observer<T, E>
  }

  interface BaseObservableConstructor {
    new<T, E>(): Observable<T, E>
  }

  interface BaseReaderConstructor {
    new<T, E>(): Reader<T, E>
  }

  export const BaseObserver: BaseObserverConstructor
  export const BaseObservable: BaseObservableConstructor
  export const BaseReader: BaseReaderConstructor

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

  interface BrowserFileReader<E> extends Reader<BrowserFileReaderStruct, E> {
    readonly options: BrowserFileReaderOptions
    readonly file: File
    readonly already: number
    readonly readType: string

    _setting (type: BrowserFileReaderType): BrowserFileReader<E>
    _read (): BrowserFileReader<E>
    _next (): BrowserFileReader<E>
    _slice (): BrowserFileReader<E>
    _onReadError (): BrowserFileReader<E>
    _onReadData (): BrowserFileReader<E>

    readAsText (): BrowserFileReader<E>
    readAsArrayBuffer (): BrowserFileReader<E>
    readAsDataURL (): BrowserFileReader<E>
  }

  interface BrowserFileReaderConstructor {
    new<E>(file: File, options?: BrowserFileReaderOptions): BrowserFileReader<E>
  }

  export const BrowserFileReader: BrowserFileReaderConstructor

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

  interface ReadLineAsUint8<E> extends Reader<ReadLineStruct, E> {

    readonly options: LineReaderOptions
    readonly file: File
    readonly reader: BrowserFileReader<E>
    readonly cache: number[]
    readonly total_lines: number

    _listen (): ReadLineAsUint8<E>
    _receive (array_buffer: ArrayBuffer): ReadLineAsUint8<E>
    _concat (array_buffer: ArrayBuffer): Uint8Array | null
    _ignore_line_break (array: Uint8Array): LineRecordStruct[]
    _normal_receive (array: Uint8Array): LineRecordStruct[]
    _send_lines (lines: LineRecordStruct[]): ReadLineAsUint8<E>
  }

  interface ReadLineAsUint8Constructor {
    new<E>(file: File, options?: LineReaderOptions): ReadLineAsUint8<E>
    readonly Type: ReadLineType
  }

  export const ReadLineAsUint8: ReadLineAsUint8Constructor

  /**
   * ====================
   * ReadLineAsString
   * ====================
   */

  interface ReadLineAsString<E> extends Reader<ReadLineStruct, E> {

    readonly file: File
    readonly options: LineReaderOptions
    readonly reader: ReadLineAsUint8<E>
    readonly utf8_parser: UTF8Parser

    _listen (): ReadLineAsString<E>
    _receive (lines: LineRecordStruct[], no: number, size: number): ReadLineAsString<E>
  }

  interface ReadLineAsStringConstructor {
    new<E> (file: File, options?: LineReaderOptions): ReadLineAsString<E>
  }

  export const ReadLineAsString: ReadLineAsStringConstructor

  /**
   * ====================
   * ReadCsvAsUint8
   * ====================
   */

  interface ReadCsvAsUint8<E> extends Reader<ReadLineStruct, E> {

    readonly file: File
    readonly options: LineReaderOptions
    readonly reader: ReadLineAsUint8<E>
    readonly csv_parser: CSVParser
    readonly utf8_parser: UTF8Parser
    readonly checker: CsvCompleteLine
    readonly count: 0

    _listen (): ReadCsvAsUint8<E>
    _onNext (record: ReadLineStruct): ReadCsvAsUint8<E>
  }

  interface ReadCsvAsUint8Constructor {
    new<E> (file: File, options?: LineReaderOptions): ReadCsvAsUint8<E>
  }

  export const ReadCsvAsUint8: ReadCsvAsUint8Constructor

  /**
   * ====================
   * ReadCsvWithLines
   * ====================
   */

  interface ReadCsvWithLines<E> extends Reader<ReadLineStruct, E> {

    readonly file: File
    readonly total: number
    readonly already: number
    readonly reader: ReadCsvAsUint8<E>
    readonly utf8_parser: UTF8Parser

    _listen (): ReadCsvWithLines<E>
    _receive (record: ReadLineStruct): ReadCsvWithLines<E>
  }

  interface ReadCsvWithLinesConstructor {
    new<E>(file: File, lines: number, options?: LineReaderOptions): ReadCsvWithLines<E>
  }

  export const ReadCsvWithLines: ReadCsvWithLinesConstructor
}