/**
 * BaseError is a custom error class that extends the built-in Error class.
 * It includes additional properties such as httpCode and isOperational to provide
 * more context about the error.
 *
 * @class
 * @extends {Error}
 */
export class BaseError extends Error {
	public override readonly name: string;
	public readonly httpCode: number;
	public readonly isOperational: boolean;

	constructor(
		name: string,
		httpCode: number,
		description: string,
		isOperational: boolean,
	) {
		super(description);
		Object.setPrototypeOf(this, new.target.prototype);

		this.name = name;
		this.httpCode = httpCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this);
	}
}
