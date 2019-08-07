/* eslint-disable no-unused-expressions */
type State = 'pending' | 'fulfilled' | 'rejected'
type FulfillHandler<T, U = any> = (value: T) => U
type RejectHandler = (reason: Error) => void
type Executor<T> = (onResolve: FulfillHandler<T>, onReject?: RejectHandler) => any
interface Observer<T> {
  onFulfilled: FulfillHandler<T>
  onRejected: RejectHandler
}

export default class Promise<T> {
  state: State = 'pending';

  reason: Error = undefined;

  settled = false;

  value: T = undefined;

  observers: Observer<T>[] = [];

  constructor(executor: Executor<T>) {
    const fulfillHandler: FulfillHandler<T> = (val: T) => {
      if (this.settled) {
        return
      }
      this.settled = true
      this.value = val
      this.state = 'fulfilled'

      this.observers.forEach(({ onFulfilled }) => {
        if (typeof onFulfilled === 'function') {
          onFulfilled(this.value)
        }
      })
    }

    const rejectHandler: RejectHandler = (reason: Error) => {
      if (this.settled) {
        return
      }
      this.settled = true
      this.reason = reason
      this.state = 'rejected'

      this.observers.forEach(({ onRejected }) => {
        if (typeof onRejected === 'function') {
          onRejected(this.reason)
        }
      })
    }

    try {
      executor(fulfillHandler, rejectHandler)
    } catch (e) {
      rejectHandler(e)
    }
  }

  then(thenFulfilled: FulfillHandler<T>, thenRejected?: RejectHandler) {
    // onFulfilled 如果不是函数，就忽略 onFulfilled，直接返回 value
    const onFulfilled: FulfillHandler<T> = typeof thenFulfilled === 'function'
      ? thenFulfilled
      : value => value
    // onRejected 如果不是函数，就忽略 onRejected，直接扔出错误
    const onRejected: RejectHandler = typeof thenRejected === 'function'
      ? thenRejected
      : (err) => { throw err }

    const handleFulfill = (
      newPromise: Promise<T>,
      resolve: FulfillHandler<T>,
      reject: RejectHandler,
    ) => {
      if (typeof onFulfilled === 'function') {
        try {
          const next = onFulfilled(this.value)
          Promise.resolvePromise(newPromise, next, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
    }

    const handleReject = (
      newPromise: Promise<any>,
      resolve: FulfillHandler<any>,
      reject: RejectHandler,
    ) => {
      if (typeof onRejected === 'function') {
        try {
          const next = onRejected(this.reason)
          Promise.resolvePromise(newPromise, next, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
    }

    const newPromise = new Promise<any>((resolve, reject) => {
      switch (this.state) {
        case 'fulfilled':
          handleFulfill(newPromise, resolve, reject)
          break
        case 'rejected':
          handleReject(newPromise, resolve, reject)
          break
        default:
          this.observers.push({
            onFulfilled: () => handleFulfill(newPromise, resolve, reject),
            onRejected: () => handleReject(newPromise, resolve, reject),
          })
      }
    })

    return newPromise
  }

  catch(onRejected: RejectHandler) {
    this.then(null, onRejected)
  }

  static all(promiseList: Promise<any>[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let count = promiseList.length
      const results: any[] = []
      if (!count) resolve(results)

      for (let i = 0, len = promiseList.length; i < len; i += 1) {
        promiseList[i].then(
          // eslint-disable-next-line no-loop-func
          (result) => {
            results[i] = result
            count -= 1
            if (count <= 0) {
              resolve(results)
            }
          },
          error => reject(error),
        )
      }
    })
  }

  static race(promiseList: Promise<any>[]) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const promise of promiseList) {
        promise.then(resolve, reject)
      }
    })
  }

  static resolve<X>(value: X) {
    return new Promise<X>(resolve => resolve(value))
  }

  static reject(reason: Error) {
    return new Promise<any>((resolve, reject) => reject(reason))
  }

  private static resolvePromise<U>(
    newPromise: Promise<U>,
    next: any,
    resolve: FulfillHandler<U>,
    reject: RejectHandler,
  ) {
    if (newPromise === next) {
      throw new Error('Loop reference between then and Promise found!')
    }
    const isObjOrFunction = (subject: any) => subject && (typeof subject === 'object' || typeof subject === 'function')
    if (isObjOrFunction(next)) {
      const { then } = next
      try {
        // 鸭子类型
        if (typeof then === 'function') {
          then.call(
            next,
            (nextOfNext: any) => {
              Promise.resolvePromise(newPromise, nextOfNext, resolve, reject)
            },
            (reason: Error) => { reject(reason) },
          )
        } else {
          resolve(next)
        }
      } catch (e) {
        reject(e)
      }
    } else {
      resolve(next)
    }
  }
}

// @ts-ignore
// eslint-disable-next-line no-multi-assign
Promise.defer = Promise.deferred = () => {
  const dfd = {}
  // @ts-ignore
  dfd.promise = new Promise((resolve, reject) => {
    // @ts-ignore
    dfd.resolve = resolve
    // @ts-ignore
    dfd.reject = reject
  })
  return dfd
}
module.exports = Promise
