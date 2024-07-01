export class Utils {
    static convertToMs(timeString) {
        const numericValue = parseInt(timeString, 10);
        if (isNaN(numericValue)) {
            throw new Error('Invalid time string format');
        }
        if (timeString.endsWith('ms')) {
            return numericValue;
        }
        else if (timeString.endsWith('s')) {
            return numericValue * 1000;
        }
        else {
            throw new Error('Unsupported time unit. Supported units are "ms" and "s"');
        }
    }
    static promiseDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=utils.js.map