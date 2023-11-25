import { ILoggerMessage } from '../types';

export interface ILoggerDirection {
  act: (message: ILoggerMessage) => void;
}
