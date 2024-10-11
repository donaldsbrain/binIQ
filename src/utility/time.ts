const startTime = Date.now();

export function now() {
    return (Date.now() - startTime) * (12 / 1000);
}