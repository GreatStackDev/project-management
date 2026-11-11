// Lets services fail with a status code without knowing about Express; the error handler turns it into a response
export class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}
