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

    preOrderTravelsal(visitor) {
        if (visitor === null) return
        const travelSal = (node) => {
            if (node === null) return
            console.log(node.element)
            visitor.visit(node.element)
            travelSal(node.left)
            travelSal(node.right)
        }

        travelSal(this.root)
    }

    centerTravelsal(visitor) {
        if (visitor === null) return
        const travelSal = (node) => {
            if (node === null) return
            travelSal(node.left)
            console.log(node.element)
            visitor.visit(node.element)
            travelSal(node.right)
        }

        travelSal(this.root)
    }

    postolderTravelsal(visitor) {
        if (visitor === null) return
        const travelSal = (node) => {
            if (node === null) return
            travelSal(node.left)
            travelSal(node.right)
            console.log(node.element)
            visitor.visit(node)
        }

        travelSal(this.root)
    }

    // 层序遍历  优化递归 或者 栈
    levelOrderTravelsal(visitor) {
        if (this.root === null || visitor === null) return null
        let stack = [this.root]
        let index = 0
        let currentNode = null
        while(currentNode = stack[index++]) {
            visitor.visit(currentNode)
            if (currentNode.left) {
                stack.push(currentNode.left)
            }

            if (currentNode.right) {
                stack.push(currentNode.right)
            }
        }
    }

    invertTree() {
        if (this.root === null ) return null
        let stack = [this.root]
        let index = 0
        let currentNode = null
        while(currentNode = stack[index++]) {
            // visitor.visit(currentNode)
            let tep = currentNode.left
            currentNode.left = currentNode.right
            currentNode.right = tep
        }

        return this.root
    }


}


const bst = new BST()
const arr = [22, 32, 12, 8, 7]
arr.forEach(item => {
    bst.add(item)
})

// console.dir(bst, {depth: 100})

bst.centerTravelsal({
    visit(node) {
        console.log(node, '*******')
    }
})

bst.invertTree()

bst.centerTravelsal({
    visit(node) {
        console.log(node, '2222222')
    }
})

// bst.levelOrderTravelsal({
//     visit(node) {
//         console.log(node.element, '*******')
//     }
// })