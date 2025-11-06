const winston = require('winston');
const context = require('./context'); // ✅ AsyncLocalStorage instance
const LokiTransport = require('winston-loki');
const path = require('path');
const moment = require('moment');
const os = require('os');

// ✅ Format to inject requestId from AsyncLocalStorage
const requestIdFormat = winston.format((info) => {
  const store = context.getStore(); // ✅ Correct way
  const requestId = store ? store.get('requestId') : 'no-request-id';
  info.requestId = requestId;
  return info;
});

// ✅ Combine all formats (JSON, timestamp, metadata)
const customFormat = winston.format.combine(
  requestIdFormat(),
  winston.format.timestamp(),
  winston.format.metadata({
    fillWith: ['requestId', 'service', 'environment', 'instance'],
  }),
  winston.format.json()
);

// ✅ Determine log directory
const getLogDirectory = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? '/var/log/todo-app' : path.join(process.cwd(), 'logs');
};

// ✅ Generate hourly log file name
const getLogFileName = () => {
  const timestamp = moment().format('YYYY-MM-DD-HH');
  const instanceName =
    process.env.NODE_ENV === 'production'
      ? process.env.EC2_HOSTNAME || os.hostname()
      : 'local';
  console.log('log directory is', getLogDirectory());
  return path.join(
    getLogDirectory(),
    `${instanceName}-${timestamp}-application.log`
  );
};

// ✅ Custom transport that switches file hourly
class DynamicFileTransport extends winston.transports.File {
  constructor(opts = {}) {
    super({
      ...opts,
      filename: getLogFileName(),
    });

    const setHourlyInterval = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

      const msUntilNextHour = nextHour - now;
      console.log('ms until next hour is', msUntilNextHour);

      // Wait until next hour, then rotate hourly
      setTimeout(() => {
        this.filename = getLogFileName();
        setInterval(() => {
          this.filename = getLogFileName();
        }, 60 * 60 * 1000);
      }, msUntilNextHour);
    };

    setHourlyInterval();
  }
}

// ✅ Transport setup (Console, File, Loki in prod)
const getTransports = () => {
  const transports = [
    new winston.transports.Console(),
    new DynamicFileTransport({
      format: customFormat,
    }),
  ];

  if (process.env.NODE_ENV === 'production') {
    transports.push(
      new LokiTransport({
        host: process.env.LOKI_URL || 'http://localhost:3100',
        json: true,
        labels: {
          app: 'todo-app',
          environment: process.env.NODE_ENV,
          instance: process.env.EC2_HOSTNAME || os.hostname(),
        },
        format: customFormat,
        batching: true,
        interval: 5,
        replaceTimestamp: true,
        onConnectionError: (err) => {
          console.error('Loki Connection error:', err);
        },
      })
    );
  }

  return transports;
};

// ✅ Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: {
    service: 'todo-app',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: getTransports(),
});

// ✅ Handle file transport errors
logger.transports.forEach((transport) => {
  if (transport instanceof winston.transports.File) {
    transport.on('error', (error) => {
      console.error('Error in file transport', error);
    });
  }
});

module.exports = logger;
