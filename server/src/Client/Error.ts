export class ServerError extends Error {
    constructor(public readonly code: number, public readonly message: string) {
        if (code < 500 || code > 599) {
            throw new TypeError("Code must be between 500 and 599")
        } 

        if (message === "") {
            throw new TypeError("Message cannot be empty")
        }
        super(message);
    }
}