export const SHIFT = ' '.repeat(2);
export const MAX_OBJECT_KEYS_LENGTH = 5;
export const MAX_DEEP_DEFAULT = 3;
export const LINE_TERMINATORS_MAP = {
    '\r': '\\r',
    '\n': '\\n',
};
export const DEFAULT_OPTIONS = {
    prefix: '->',
    deep: MAX_DEEP_DEFAULT,
    color: true,
    oneline: false,
    align: false,
    undefined: true,
    keys: [],
    excludePath: [],
    excludeKeys: [],
    only: [],
    lineTerminators: false,
};
