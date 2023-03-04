export class InvalidFieldError extends Error {
    constructor(message: string) {
        super(`Invalid field: ${message}`);
        this.name = 'InvalidFieldError';
    }
}
