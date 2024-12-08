import winston from "winston";

// Define log levels
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Define colors for each log level
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Custom format for console output (with colors)
const consoleFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info) => `[${info["timestamp"]}] [${info.level}]: ${info.message}`,
	),
);

// Custom format for file output (without colors)
const fileFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.printf(
		(info) =>
			`[${info["timestamp"]}] [${info.level.toUpperCase()}]: ${info.message}`,
	),
);

const logger = winston.createLogger({
	level: "debug",
	levels,
	transports: [
		new winston.transports.Console({
			format: consoleFormat,
		}),
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: fileFormat,
		}),
		new winston.transports.File({
			filename: "logs/all.log",
			format: fileFormat,
		}),
	],
});

export default logger;
