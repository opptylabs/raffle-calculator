export function round(number, decimals) {

    if (decimals === -1) {
        if (number < 3) {
            decimals = 1
        } else if (number < 1) {
            decimals = 2
        } else {
            decimals = 0
        }
    }

    decimals = decimals || 0
    let divider = '1'
    for (let i = 0; i < decimals; i++) {
        divider += '0';
    }
    return Math.round(number * divider) / divider
}