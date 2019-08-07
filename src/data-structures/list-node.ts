/**
 * 单链表节点
 */
export class ListNode<T> implements Iterable<T> {
  /**
   * 单链表节点的构造器
   * @param val 此节点的值
   * @param next 后继节点，默认为 `null`
   */
  constructor(
    public val: T,
    public next: ListNode<T> = null,
  ) { }

  /**
   * 迭代器，使从该节点开始的单链表可以被 `for...of` 迭代
   */
  * [Symbol.iterator]() {
    let current = this
    while (current) {
      yield current.val
      // @ts-ignore
      current = current.next
    }
  }
}
