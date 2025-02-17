export class AppError extends Error {
    constructor(message ,statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const globalhandleError = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message || err });
    }
    return res.status(500).json({ message: "Internal Server Error" });
}