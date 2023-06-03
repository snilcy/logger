import { isArray, shallowMerge } from '@snilcy/cake';
import { LoggerLevel } from './const.js';
import { ConsoleDirection } from './directions/index.js';
const LoggerDirections = {
    console: ConsoleDirection,
};
export class Logger {
    disabled = false;
    namespace = [];
    directions = {};
    directionsArgs = {};
    constructor(namespace, directionsArgs) {
        this.namespace = isArray(namespace) ? namespace : [namespace];
        this.directionsArgs = directionsArgs;
        for (const key in directionsArgs) {
            const directionName = key;
            const args = directionsArgs[directionName];
            if (args) {
                this.directions[directionName] = new LoggerDirections[directionName](args);
            }
        }
    }
    message(level, data) {
        if (this.disabled) {
            return;
        }
        Object.values(this.directions).forEach((direction) => {
            direction.act({
                level,
                data,
                namespace: this.namespace,
            });
        });
    }
    ns(namespace, directionsArgs = {}) {
        return new Logger(this.namespace.concat(namespace), shallowMerge(this.directionsArgs, directionsArgs));
    }
    log(level, ...args) {
        this.message(level, args);
    }
    debug(...args) {
        this.message(LoggerLevel.DEBUG, args);
    }
    info(...args) {
        this.message(LoggerLevel.INFO, args);
    }
    warn(...args) {
        this.message(LoggerLevel.WARN, args);
    }
    error(...args) {
        this.message(LoggerLevel.ERROR, args);
    }
}
