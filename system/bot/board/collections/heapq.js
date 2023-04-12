class BinaryHeap {
    constructor(compareFn) {
        this.compareFn = compareFn || BinaryHeap.defaultCompare;
        this.heap = [];
    }

    // Get the default comparison function
    static defaultCompare(a, b) {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    }

    // Get the parent index of a given index
    static getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Get the left child index of a given index
    static getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    // Get the right child index of a given index
    static getRightChildIndex(index) {
        return 2 * index + 2;
    }

    // Swap two elements in the heap
    swap(a, b) {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
    }

    // Add an element to the heap
    push(value) {
        this.heap.push(value);
        this.siftUp(this.heap.length - 1);
    }

    // Remove and return the root element from the heap
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return root;
    }

    // Peek at the root element of the heap without removing it
    peek() {
        return this.heap[0];
    }

    // Get the number of elements in the heap
    size() {
        return this.heap.length;
    }

    // Check if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Sift up an element at the given index to maintain the heap property
    siftUp(index) {
        let parentIndex = BinaryHeap.getParentIndex(index);
        while (
                index > 0 &&
                this.compareFn(this.heap[index], this.heap[parentIndex]) < 0
                ) {
            this.swap(index, parentIndex);
            index = parentIndex;
            parentIndex = BinaryHeap.getParentIndex(index);
        }
    }

    // Sift down an element at the given index to maintain the heap property
    siftDown(index) {
        let leftChildIndex = BinaryHeap.getLeftChildIndex(index);
        let rightChildIndex = BinaryHeap.getRightChildIndex(index);
        let smallerChildIndex = leftChildIndex;

        if (
                rightChildIndex < this.heap.length &&
                this.compareFn(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0
                ) {
            smallerChildIndex = rightChildIndex;
        }

        if (
                smallerChildIndex < this.heap.length &&
                this.compareFn(this.heap[smallerChildIndex], this.heap[index]) < 0
                ) {
            this.swap(smallerChildIndex, index);
            this.siftDown(smallerChildIndex);
        }
    }
}

export default BinaryHeap;


