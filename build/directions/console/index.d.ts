import type { ILoggerDirection } from '../types.js';
import type { ILoggerMessage } from '../../types.js';
import type { IConsoleDirectionOptions } from './types.js';
export declare class ConsoleDirection implements ILoggerDirection {
    private options;
    constructor(options: IConsoleDirectionOptions);
    private format;
    act(body: ILoggerMessage): void;
    static stringify: (data: ILoggerMessage['data'], options?: IConsoleDirectionOptions, currentDeep?: number) => string;
}
