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
        if (this.root == null) {
            this.root = new Node(element, null)
            return
        } else {
            let current = this.root
            let parent = null
            let compare = 0
            while(current) {
                compare = element - current.element
                parent = current
                if ( compare > 0 ) {
                    current = current.right
                } else {
                    current = current.left
                }
            }

            let newNode = new Node(element, parent)
            if (compare > 0) {
                parent.right = newNode
            } else {
                parent.left = newNode
            }
        }
    }
}

let bst = new BST()
let arr = [10, 8, 19, 20, 3, 1]

arr.forEach(element => {
    bst.add(element)
})

console.dir(bst, {depth: 100});