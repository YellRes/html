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

        if (this.size === 0) {
            this.head = new Node(element, this.head)
        } else {
            let preNode = this.getNodeByIndex(index - 1) 
            preNode.next = new Node(element, preNode.next)
        }

        this.size++
    }

    getNodeByIndex(index) {
        let current = this.head
        for (let i = 0; i < index; i++) {
            current = current.next
        }
        return current
    }

    
    remove(index) {
        if (index === 0) {
            let node = this.head
            if (!node) return null
            this.head = node.next
            return node.element
        } 
    }
}

// const ll = new LinkList()

// ll.add(10)
// ll.add(9)
// ll.add(1, 4)
// ll.add(2, 6)

// console.dir(ll, {depth: 1000})

module.exports = LinkList

