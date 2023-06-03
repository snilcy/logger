import { LoggerLevel } from './const.js';
import { ILoggerMessage } from './types.js';
import { ConsoleDirection } from './directions/index.js';
declare const LoggerDirections: {
    console: typeof ConsoleDirection;
};
type LoggerDirectionsType = typeof LoggerDirections;
type ILoggerDirectionsArgs = {
    [Property in keyof LoggerDirectionsType]?: ConstructorParameters<LoggerDirectionsType[Property]>[0];
};
type INamespaceParam = string | string[];
export declare class Logger {
    private disabled;
    private namespace;
    private directions;
    private directionsArgs;
    constructor(namespace: INamespaceParam, directionsArgs: ILoggerDirectionsArgs);
    private message;
    ns(namespace: INamespaceParam, directionsArgs?: ILoggerDirectionsArgs): Logger;
    log(level: LoggerLevel, ...args: ILoggerMessage['data']): void;
    debug(...args: ILoggerMessage['data']): void;
    info(...args: ILoggerMessage['data']): void;
    warn(...args: ILoggerMessage['data']): void;
    error(...args: ILoggerMessage['data']): void;
}
export {};
