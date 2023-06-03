import chalk from 'chalk';
export var LoggerDirectionType;
(function (LoggerDirectionType) {
    LoggerDirectionType[LoggerDirectionType["CONSOLE"] = 0] = "CONSOLE";
    LoggerDirectionType[LoggerDirectionType["FILE"] = 1] = "FILE";
})(LoggerDirectionType || (LoggerDirectionType = {}));
export var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["DEBUG"] = 0] = "DEBUG";
    LoggerLevel[LoggerLevel["INFO"] = 1] = "INFO";
    LoggerLevel[LoggerLevel["WARN"] = 2] = "WARN";
    LoggerLevel[LoggerLevel["ERROR"] = 3] = "ERROR";
})(LoggerLevel || (LoggerLevel = {}));
export const LoggerMethodsMap = {
    [LoggerLevel.DEBUG]: 'debug',
    [LoggerLevel.INFO]: 'info',
    [LoggerLevel.WARN]: 'warn',
    [LoggerLevel.ERROR]: 'error',
};
export const LoggerSymbolMap = {
    [LoggerLevel.DEBUG]: 'D',
    [LoggerLevel.INFO]: 'I',
    [LoggerLevel.WARN]: 'W',
    [LoggerLevel.ERROR]: 'E',
};
export const LoggerColorMap = {
    [LoggerLevel.DEBUG]: chalk.magenta,
    [LoggerLevel.INFO]: chalk.blue,
    [LoggerLevel.WARN]: chalk.yellow,
    [LoggerLevel.ERROR]: chalk.red,
};
