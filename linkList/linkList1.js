class Node {
    constructor(element, next) {
        this.element = element
        this.next = next
    }
}

class LinkList {
    constructor() {
        this.head = null
        this.size = 0
    }

    add(index, element) {
        if (arguments.length === 1) {
            element = index
            index = this.size
        }

        if (index < 0 || index > this.size + 1) throw new Error('越界')

        if (!this.head) {
            this.head = new Node(element, this.head)
        } else {
            let preNode = this.getNodeByIndex(index - 1)    
            preNode.next = new Node(element, preNode.next)
        }
    }

    getNodeByIndex(index) {

    }

    remove(index) {
        if (index === 0) {
            let node = this.head
            if (!node) return null
            this.head = node.next
            return node
        } 
    }
}

module.exports = LinkList

// const ll = new LinkList()

// ll.add(10)
// ll.add(9)
// ll.add(1, 4)
// ll.add(2, 6)

// console.dir(ll, {depth: 1000})