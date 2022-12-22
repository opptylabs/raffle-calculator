export function timestamp() {
    return Math.floor((Date.now ? Date.now() : new Date().getTime()) / 1000)
}