import { ListNode } from '../data-structures/list-node'

/**
 * 从数组生成单链表
 * @param arr 源数组
 */
export function mapArrayToList<T>(arr: T[]) {
  if (!arr.length) return null
  const vHead = new ListNode<T>(null)
  let p = vHead

  for (const item of arr) {
    p.next = new ListNode<T>(item)
    p = p.next
  }

  return vHead.next
}
