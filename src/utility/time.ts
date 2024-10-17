const startTime = Date.now();

export function now12() {
    return (Date.now() - startTime) * (12 / 1000);
}