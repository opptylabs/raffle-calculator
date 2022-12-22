import { PublicKey } from '@solana/web3.js'

export function validate_address(input) {
    if (input == null || input === "") {
        return false
    }
    try {
        new PublicKey(input);
    } catch (err) {
        return false
    }
    return true
}
