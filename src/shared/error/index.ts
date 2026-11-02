export class ClientError extends Error {
    public readonly status: number;

    constructor (message: string, status: number) {
        super(message)
        this.status = status;
        this.name = new.target.name;
    }
}

export class BadRequest extends ClientError {
    constructor(message = "Bad request"){
        super(message, 400)
    }
}

export class Unauthorized extends ClientError {
    constructor(message = "Unauthorized request"){
        super(message, 401)
    }
}

export class Forbidden extends ClientError {
    constructor(message = "Forbiden request"){
        super(message, 403)
    }
}

export class NotFound extends ClientError {
    constructor(message = "Not Found") {
        super(message, 404)
    }
}
