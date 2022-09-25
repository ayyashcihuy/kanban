export class ClientError extends Error{
    constructor(public readonly code: number, public readonly message: string) {
        if (code < 400 || code > 499) {
            throw new TypeError("Code must be between 400 and 499")
        } 

        if (message === "") {
            throw new TypeError("Message cannot be empty")
        }

        super(message);
    }
}