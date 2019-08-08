type treeNodeTraverseFunc<T, U> = (node: BinaryTreeNode<T>) => U

/**
 * 二叉树节点
 */
export class BinaryTreeNode<T> {
  constructor(
    public value: T,
    public left: BinaryTreeNode<T> = null,
    public right: BinaryTreeNode<T> = null,
  ) {}

  /**
   * 广度优先遍历
   * @param fn 对每个节点的操作
   */
  bfs<X>(fn: treeNodeTraverseFunc<T, X>): X[] {
    const result = []

    const queue: BinaryTreeNode<T>[] = [this]
    while (queue.length) {
      const node = queue.shift()
      if (node.left) {
        queue.push(node.left)
      }
      if (node.right) {
        queue.push(node.right)
      }
      result.push(fn(node))
    }

    return result
  }

  /**
   * 深度优先 - 前序遍历
   * @param fn 对每个节点的操作
   */
  dfsPreOrder<X>(fn: treeNodeTraverseFunc<T, X>): X[] {
    const result = []

    const stack: BinaryTreeNode<T>[] = [this]
    while (stack.length) {
      const node = stack.pop()
      if (node.right) {
        stack.push(node.right)
      }
      if (node.left) {
        stack.push(node.left)
      }
      result.push(fn(node))
    }

    return result
  }

  /**
   * 深度优先 - 中序遍历
   * @param fn 对每个节点的操作
   */
  dfsInOrder<X>(fn: treeNodeTraverseFunc<T, X>): X[] {
    let p: BinaryTreeNode<T> = this

    const result = []
    const queue: BinaryTreeNode<T>[] = []

    while (p || queue.length) {
      if (p) {
        queue.push(p)
        p = p.left
      } else {
        const node = queue.pop()
        result.push(fn(node))
        p = node.right
      }
    }

    return result
  }

  /**
   * 深度优先 - 后序遍历
   * @param fn 对每个节点的操作
   */
  dfsPostOrder<X>(fn: treeNodeTraverseFunc<T, X>): X[] {
    const result = []
    const stack1 = []
    const stack2 = []

    let node: BinaryTreeNode<T> = this

    stack1.push(node)
    while(stack1.length !== 0) {
      node = stack1.pop()
      stack2.push(node)

      if(node.left) {
        stack1.push(node.left)
      }
      if(node.right) {
        stack1.push(node.right)
      }
    }

    while(stack2.length !== 0) {
      result.push(fn(stack2.pop()))
    }

    return result
  }

  /**
   * 从完全二叉树的 BFS 数组构造二叉树
   * @param arr BFS 数组，空元素用 null 表示
   * @param start 数组的开始下标，用于递归
   */
  static fromFullBinaryTreeArr<T>(arr: T[], start: number = 0): BinaryTreeNode<T> {
    if (!arr || !arr.length) {
      throw new TypeError('Need an non-empty array')
    }

    if (arr[start] == null) {
      return null
    }

    const root = new BinaryTreeNode(arr[start])

    const leftIndex = 2 * start + 1
    if (leftIndex > arr.length - 1) {
      root.left = null
    } else {
      root.left = BinaryTreeNode.fromFullBinaryTreeArr(arr, leftIndex)
    }

    const rightIndex = 2 * start + 2
    if (rightIndex > arr.length - 1) {
      root.right = null
    } else {
      root.right = BinaryTreeNode.fromFullBinaryTreeArr(arr, rightIndex)
    }

    return root
  }
}
