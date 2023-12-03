export function chunkIntoN<T>(arr: T[], n: number): T[][] {
    const size = Math.ceil(arr.length / n);
    return Array.from({ length: n }, (_, i) => arr.slice(i * size, i * size + size));
}

export function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function intersect<T>(a: T[], b: T[]): T[] {
    return a.filter(e => b.includes(e));
}

export function maxBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) > fn(current)) ? prev : current);
}

export function minBy<T>(arr: T[], fn: (el: T) => number) {
    return arr.reduce((prev, current) => (prev && fn(prev) < fn(current)) ? prev : current);
}

export function sum(arr: number[]) {
    return arr.reduce((total, next) => total + next, 0);
}

export function indicesOf(needle: string, haystack: string) {
    const indices = [];
    for (let i = 0; i < haystack.length; i++)
        if (haystack[i] == needle)
            indices.push(i);
    return indices;
}

export function isNumber(obj: any): obj is number {
    return Number.isFinite(obj);
}

export function isInteger(str: string): number | false {
    const parsed = parseInt(str);
    if (isNaN(parsed))
        return false;
    return parsed;
}

export function assertNotFalsy<T>(obj: T | undefined): T {
    if (!obj)
        throw Error(`Falsy value asserted to be not falsy: ${obj}`);
    return obj;
}
