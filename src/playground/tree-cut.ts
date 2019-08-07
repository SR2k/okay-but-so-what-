interface TreeNode {
  title: string,
  key: string,
  children?: TreeNode[]
}

interface TreeNodeWithParent {
  node: TreeNode
  parent?: TreeNode
}

function treeDfs(rootNode: TreeNode, selectedKeys: string[]) {
  if (!rootNode) return rootNode
  // tslint:disable-next-line:prefer-type-cast
  const root = JSON.parse(JSON.stringify(rootNode)) as TreeNode

  const isSelected = (key: string) => selectedKeys.includes(key)

  const preStack: TreeNodeWithParent[] = []
  const postStack: TreeNodeWithParent[] = []
  preStack.push({ node: root })

  while (preStack.length) {
    const node = preStack.pop()
    postStack.push(node)
    if (node.node.children && node.node.children.length) {
      preStack.push(...node.node.children.map(n => ({
        node: n,
        parent: node.node
      })))
    }
  }

  while (postStack.length) {
    const { node, parent } = postStack.pop()

    if ((!node.children || !node.children.length) && !isSelected(node.key) && parent && parent.children) {
      parent.children = parent.children.filter(n => n.key !== node.key)
    }
  }

  return root
}

const tree: TreeNode = {
  title: 'root',
  key: 'root',
  children: [
    {
      title: '北京市',
      key: '0-0',
      children: [
        {
          title: '海定区',
          key: '0-0-0',
          children: [
            {title: '0-0-0-0', key: '0-0-0-0'},
            {title: '0-0-0-1', key: '0-0-0-1'},
            {title: '0-0-0-2', key: '0-0-0-2'},
          ],
        },
        {
          title: '朝阳区',
          key: '0-0-1',
          children: [
            {title: '0-0-1-0', key: '0-0-1-0'},
            {title: '0-0-1-1', key: '0-0-1-1'},
            {title: '0-0-1-2', key: '0-0-1-2'},
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '浙江省',
      key: '0-1',
      children: [
        {title: '0-1-0-0', key: '0-1-0-0'},
        {title: '0-1-0-1', key: '0-1-0-1'},
        {title: '0-1-0-2', key: '0-1-0-2'},
      ],
    },
    {
      title: '上海市',
      key: '0-2',
    },
  ],
}

console.log(JSON.stringify(treeDfs(tree, ['0-1-0-1']), null, 2))
