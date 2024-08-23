export const generateSecurePin = (length=1) => {
    if (length <= 0) {
        length = 4
    }
    const digits = '0123456789';
    let pin = '';
    // Generate secure random values and map them to digits
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        pin += digits[randomIndex];
    }

    return pin;
}
