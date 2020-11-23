class Node {
  constructor(element, next) {
    this.element = element
    this.next = next
  }
}

class LinkList {

  constructor() {
    this.size = 0
    this.head = null
  }

  add(index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) new Error('越界')
    
    if (!this.head) {
      this.head = new Node(element, this.head)
    } else {
      let preNodeIndex = this.getPreNode(index - 1)
      preNodeIndex.next = new Node(element, preNodeIndex.next)
    }
  }

  getPreNode (index) {
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }
}

const ll = new LinkList()
ll.add(9)
ll.add(5)
ll.add(1, 5)
ll.add(2, 5)

