function chunkIntoN<T>(arr: T[], n: number): T[][] {
    const size = Math.ceil(arr.length / n);
    return Array.from({ length: n }, (_, i) => arr.slice(i * size, i * size + size));
}

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function intersect<T>(a: T[], b: T[]): T[] {
    return a.filter(e => b.includes(e));
}

function maxBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) > fn(current)) ? prev : current);
}

function minBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) < fn(current)) ? prev : current);
}

function sum(arr: number[]) {
    return arr.reduce((total, next) => total + next, 0);
}

function indicesOf(needle: string, haystack: string) {
    const indices = [];
    for (let i = 0; i < haystack.length; i++)
        if (haystack[i] == needle)
            indices.push(i);
    return indices;
}
