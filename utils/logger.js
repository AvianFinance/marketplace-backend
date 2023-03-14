const { createLogger, transports, format } = require('winston');

const customFormat = format.combine(format.timestamp(), format.printf((info) => {
    return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
}))

const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.Console({ level: 'debug' }),
        new transports.File({ filename: './logs/app.log', level: 'info' })
    ]
});

module.exports = logger;