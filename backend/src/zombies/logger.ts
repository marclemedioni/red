import bunyan from 'bunyan';
import path from 'path';
import RotatingFileStream from 'bunyan-rotating-file-stream'
import { rootPath } from '../settings';
import fs from 'fs';

const dir = path.join(rootPath, 'logs');

if (!fs.existsSync(dir)) {
    console.log('Logs folder created');
    fs.mkdirSync(dir);
}

export const infoLog = bunyan.createLogger({
    name: 'info',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/info.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

export const exceptionLog = bunyan.createLogger({
    name: 'exception',
    streams: [{
        stream: process.stderr
    },
    {
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/exception.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

export const welcomeLog = bunyan.createLogger({
    name: 'welcome',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/welcome.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

export const actionLog = bunyan.createLogger({
    name: 'action',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/action.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

export const moveLog = bunyan.createLogger({
    name: 'move',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/move.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

export const errorLog = bunyan.createLogger({
    name: 'error',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/error.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    },
    {
        stream: process.stdout
    }]
})

export const commandLog = bunyan.createLogger({
    name: 'command',
    streams: [{
        stream: new RotatingFileStream({
            path: path.join(rootPath, 'logs/command.%d-%b-%y.log'),
            period: '15d',          // daily rotation
            totalFiles: 10,        // keep up to 10 back copies
            rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
            threshold: '10m',      // Rotate log files larger than 10 megabytes
            totalSize: '20m',      // Don't keep more than 20mb of archived log files
        })
    }]
})

process.on('SIGUSR2', () => {
    infoLog.reopenFileStreams();
    welcomeLog.reopenFileStreams();
    actionLog.reopenFileStreams();
    moveLog.reopenFileStreams();
    errorLog.reopenFileStreams();
    commandLog.reopenFileStreams();
    exceptionLog.reopenFileStreams();
});