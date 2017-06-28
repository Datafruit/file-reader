//
//

declare namespace Reader {

  export function notImplemented (name: string): () => never

  /**
   * =============================================
   * Abstract Class
   * =============================================
   */

  export abstract class AbstractObserver {
    constructor ()

    error (): AbstractObserver

    next (): AbstractObserver

    complete (): AbstractObserver

    onNext (): AbstractObserver

    onError (): AbstractObserver

    onComplete (): AbstractObserver

    isDestroy (): AbstractObserver
  }

  export abstract class AbstractObservable {
    constructor ()

    subscribe (): AbstractObserver

    subscribeOnNext (): AbstractObserver

    subscribeOnError (): AbstractObserver

    subscribeOnComplete (): AbstractObserver
  }

  export abstract class AbstractReader extends AbstractObservable {
    constructor ()

    read (): AbstractObserver

    pause (): AbstractObserver

    resume (): AbstractObserver

    enqueue (): AbstractObserver

    onReadData (): AbstractObserver

    onReadError (): AbstractObserver

    onReadComplete (): AbstractObserver

    readable (): AbstractObserver

    validate (): AbstractObserver

    result (): AbstractObserver

    isLastSnippet (): AbstractObserver
  }

  /**
   * =============================================
   * Base
   * =============================================
   */

  export class BaseObserver extends AbstractObserver {
    constructor (onNext?: () => void, onError?: () => void, onComplete?: () => void)

    destroyed: boolean
  }

  export class BaseObservable extends AbstractObservable {
    constructor ()

    subscribe ()
  }
}

export = Reader
