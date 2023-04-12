class BinaryHeap {
    constructor() {
        this.heap = [];
    }

    // Add an element to the heap
    push(value) {
        this.heap.push(value);
        this._siftUp(this.heap.length - 1);
    }

    // Remove and return the smallest element from the heap
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const minValue = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._siftDown(0);

        return minValue;
    }

    // Get the smallest element from the heap without removing it
    peek() {
        return this.isEmpty() ? null : this.heap[0];
    }

    // Check if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Get the size of the heap
    size() {
        return this.heap.length;
    }

    // Internal method to maintain the heap property by moving an element up
    _siftUp(index) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (index > 0 && this.heap[parentIndex] > this.heap[index]) {
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            this._siftUp(parentIndex);
        }
    }

    // Internal method to maintain the heap property by moving an element down
    _siftDown(index) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallestIndex = index;

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
            smallestIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            this._siftDown(smallestIndex);
        }
    }

    // Static method to push an element to the heap
    static heappush(heap, value) {
        heap.push(value);
        BinaryHeap._siftUpStatic(heap, heap.length - 1);
    }

    // Static method to pop and return the smallest element from the heap
    static heappop(heap) {
        if (heap.length === 0) {
            return null;
        }
        if (heap.length === 1) {
            return heap.pop();
        }

        const minValue = heap[0];
        heap[0] = heap.pop();
        BinaryHeap._siftDownStatic(heap, 0);

        return minValue;
    }

    // Static method to maintain the heap property by moving an element up
    static _siftUpStatic(heap, index) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (index > 0 && heap[parentIndex] > heap[index]) {
            [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];
            BinaryHeap._siftUpStatic(heap, parentIndex);
        }
    }

    // Static method to maintain the heap property by moving an element down
    static _siftDownStatic(heap, index) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallestIndex = index;
        if (leftChildIndex < heap.length && heap[leftChildIndex] < heap[smallestIndex]) {
            smallestIndex = leftChildIndex;
        }

        if (rightChildIndex < heap.length && heap[rightChildIndex] < heap[smallestIndex]) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            [heap[index], heap[smallestIndex]] = [heap[smallestIndex], heap[index]];
            BinaryHeap._siftDownStatic(heap, smallestIndex);
        }
    }
}

export default BinaryHeap;