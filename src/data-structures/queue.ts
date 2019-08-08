import { SinglePointerNode } from './single-pointer-node.interface'

export class QueueNode<T> extends SinglePointerNode<T> { }

/**
 * 队列：先进先出
 */
export class Queue<T> implements Iterable<T> {
  private head: QueueNode<T> = new QueueNode<T>()

  private tail: QueueNode<T> = null

  private size: number = 0

  constructor() {
    this.head.next = this.tail
    this.tail = this.head
  }

  /**
   * 入队
   */
  public enqueue(value: T) {
    const oldTail: QueueNode<T> = this.tail
    this.tail = new QueueNode<T>(value)

    if (this.isEmpty) {
      this.head.next = this.tail
    } else {
      oldTail.next = this.tail
    }

    this.size++
  }

  /**
   * 出队
   */
  public dequeue(): T {
    if (this.isEmpty) return

    const first: QueueNode<T> = this.head.next
    this.head.next = first.next
    this.size--
    return first.value
  }

  /**
   * 是否为空队列
   */
  public get isEmpty() {
    return this.size < 1
  }

  * [Symbol.iterator]() {
    if (this.isEmpty) return

    let current = this.head.next
    while (current) {
      yield current.value
      current = current.next
    }
  }
}

