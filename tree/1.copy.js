class Node {
    constructor(element, parent) {
        this.element = element
        this.parent = parent
        this.left = null
        this.right = null
    }
}

class BST {

    constructor() {
        this.root = null
        this.size = 0
    }

    add(element) {
        if (!this.root) {
            this.root = new Node(element, null)
        } else {
            let current = this.root
            let compare = 0
            let parentNode = null
            while(current) {
                parentNode = current
                compare = element - current.element
                if (compare > 0) {
                    current = current.right
                } else {
                    current = current.left
                }
            }

            if (compare > 0) {
                parentNode.right = new Node(element, parentNode)
            } else {
                parentNode.left = new Node(element, parentNode)
            }
        }
    }
}


const bst = new BST()
const arr = [22, 32, 12, 8, 7]
arr.forEach(item => {
    bst.add(item)
})

console.dir(bst, {depth: 100})