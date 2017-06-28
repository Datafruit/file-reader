export = Reader
export as namespace Reader
declare namespace Reader {
  export function notImplemented (name: string): () => never

  /**
   * ====================
   * Base
   * ====================
   */
  export interface OnNext<T> {
    (arg: T): any
  }
  export interface OnError<T> {
    (err: T): any
  }
  export interface OnComplete {
    (): any
  }
  /**
   * ====================
   * Queue
   * ====================
   */
  export class Queue<T> {
    constructor (max_queue: number)

    private _queue: T[]
    private _point: number
    private _total: number
    private _max_queue: number

    reset (queue: T[]): Queue<T>

    queue (data: T): Queue<T>

    dequeue (): T|null

    full (): boolean

    undequeued (): number

    done (): boolean

    forEach (fn: (data: T|null) => void): Queue<T>

    rollback (): number

    forward (): number
  }
  /**
   * ====================
   * Observer
   * ====================
   */
  class Observer<T, E> {
    constructor (onNext?: OnNext<T>, onError?: OnError<E>, onComplete?: OnComplete)

    readonly prototype
    readonly destroyed: boolean
    readonly next: OnNext<T>
    readonly error: OnError<E>
    readonly complete: OnComplete

    onNext (data: T): Observer<T, E>

    onError (err: E): Observer<T, E>

    onComplete (): Observer<T, E>

    destroy (): Observer<T, E>

    isDestroy (): boolean

    isObserver (arg: any): boolean
  }
  /**
   * ====================
   * Observable
   * ====================
   */
  class Observable<T, E> {
    constructor ()

    subscribe (observerOrOnNext: Observer<T, E>|OnNext<T>,
      onError: OnError<E>,
      onComplete: OnComplete): Observable<T, E>

    subscribeOnNext (data: T): Observable<T, E>

    subscribeOnError (err: E): Observable<T, E>

    subscribeOnComplete (): Observable<T, E>
  }
  /**
   * ====================
   * Observable
   * ====================
   */
  interface ReaderStruct<T> {
    data: T
    sequence: number
  }
  class Reader<T,E> extends Observable<ReaderStruct<T>,E> {
    private _readable: boolean
    readonly queue: Queue<ReaderStruct<T>>
    readonly chunks: number

    read (): Reader<ReaderStruct<T>,E>

    pause (): Reader<ReaderStruct<T>,E>

    resume (): Reader<ReaderStruct<T>,E>

    readable (): Reader<ReaderStruct<T>,E>

    enqueue (data: ReaderStruct<T>): Reader<ReaderStruct<T>,E>

    onReadData (): Reader<ReaderStruct<T>,E>

    onReadError (err: E): Reader<ReaderStruct<T>,E>

    onReadComplete (): Reader<ReaderStruct<T>,E>

    validate (data: ReaderStruct<T>, sequence: number): boolean

    result (data: ReaderStruct<T>, sequence: number): any

    isLastSnippet (data: ReaderStruct<T>, sequence: number): boolean
  }
  /**
   * ====================
   * export Base Class
   * ====================
   */
  export const BaseObserver = Observable
  export const BaseObservable = Observable
  export const BaseReader = Reader
  /**
   * ====================
   * BrowserFileReader
   * ====================
   */
  interface BrowserFileReaderOptions {
    encode?: 'utf8'
    read_size?: 0
    chunk_size?: 65536 // 1<<16
    concurrency: 1
  }
  type BrowserFileReaderType = 'Text' | 'ArrayBuffer' | 'DataURL'
  interface BrowserFileReaderStruct {
    reader: FileReader
    start: number
    end: number
  }
  class BrowserFileReader<E> extends Reader<BrowserFileReaderStruct,E> {
    constructor (file: File, options?: BrowserFileReaderOptions)

    readonly options: BrowserFileReaderOptions
    readonly file: File
    readonly already: number
    readonly readType: string

    private _setting (type: BrowserFileReaderType): BrowserFileReader<BrowserFileReaderStruct,E>

    private _read (): BrowserFileReader<BrowserFileReaderStruct,E>

    private _next (): BrowserFileReader<BrowserFileReaderStruct,E>

    private _slice (): BrowserFileReader<BrowserFileReaderStruct,E>

    readAsText (): BrowserFileReader<BrowserFileReaderStruct,E>

    readAsArrayBuffer (): BrowserFileReader<BrowserFileReaderStruct,E>

    readAsDataURL (): BrowserFileReader<BrowserFileReaderStruct,E>

    _onReadError (): BrowserFileReader<BrowserFileReaderStruct,E>

    _onReadData (): BrowserFileReader<BrowserFileReaderStruct,E>
  }
}
