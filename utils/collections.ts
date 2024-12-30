export class PriorityQueue<T> {
    private items: { element: T; priority: number }[] = [];

    enqueue(element: T, priority: number) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): T | undefined {
        return this.items.shift()?.element;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    clear(): undefined {
        this.items = [];
    }
}

export class CircularBuffer<T> {
    private buffer: T[] = [];

    constructor(private readonly capacity: number) {
        this.buffer = new Array<T>(capacity);
    }

    push(element: T) {
        if (this.buffer.length >= this.capacity) {
            this.buffer.shift();
        }

        this.buffer.push(element);
    }

    isEmpty(): boolean {
        return this.buffer.length === 0;
    }

    clear(): undefined {
        this.buffer = [];
    }

    *[Symbol.iterator](): Iterator<T> {
        for (let i = 0; i < this.buffer.length; i++) {
            yield this.buffer[i];
        }
    }
}
