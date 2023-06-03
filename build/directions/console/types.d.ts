import { ILoggerMessage } from '../../types.js';
export interface IConsoleDirectionOptions {
    prefix?: string;
    format?: (body: ILoggerMessage) => string;
    deep?: number;
    color?: boolean;
    oneline?: boolean;
    align?: boolean;
    undefined?: boolean;
    keys?: string[];
    excludePath?: string[];
    excludeKeys?: string[];
    only?: string[];
    lineTerminators?: boolean;
}
