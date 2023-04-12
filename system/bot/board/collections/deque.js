class Deque {
    constructor() {
        this.items = [];
    }

    // Add element to the front of the deque
    prepend(element) {
        this.items.unshift(element);
    }

    // Add element to the rear of the deque
    append(element) {
        this.items.push(element);
    }

    // Remove and return the element from the front of the deque
    popleft() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }

    // Remove and return the element from the rear of the deque
    popright() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.pop();
    }

    // Return the element from the front of the deque without removing it
    left() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[0];
    }

    // Return the element from the rear of the deque without removing it
    right() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }

    // Check if the deque is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Return the number of elements in the deque
    size() {
        return this.items.length;
    }

    // Clear the deque
    clear() {
        this.items = [];
    }
}


export default Deque;

