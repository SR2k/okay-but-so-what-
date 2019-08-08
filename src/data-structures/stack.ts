import { SinglePointerNode } from './single-pointer-node.interface'

export class StackNode<T> extends SinglePointerNode<T> {}

/**
 * 栈：后进先出
 */
export class Stack<T> implements Iterable<T> {
  private head = new StackNode<T>()

  private size: number = 0

  /**
   * 是否为空栈
   */
  public get isEmpty() {
    return this.size < 1
  }

  /**
   * 栈顶元素
   */
  public get top() {
    return this.head.next
  }

  /**
   * 压栈
   * @param item 元素
   */
  public push(item: T) {
    this.head.next = new StackNode<T>(item, this.head.next)
    this.size++
  }

  /**
   * 弹栈
   */
  public pop(): T {
    if (this.isEmpty) return

    const first = this.head.next
    this.head.next = first.next
    this.size--
    return first.value
  }

  * [Symbol.iterator]() {
    if (this.isEmpty) return

    let head = this.head.next
    while (head) {
      yield head.value
      head = head.next
    }
  }

  /**
   * 从数组构造栈
   */
  static fromArray<U>(array: U[]): Stack<U> {
    const stack = new Stack<U>()
    for (let item of array) {
      stack.push(item)
    }
    return stack
  }
}
