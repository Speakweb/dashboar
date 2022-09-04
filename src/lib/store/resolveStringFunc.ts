import {StringOrStringFunc} from "../config/config";

export const resolveStringFunc = (s: StringOrStringFunc) => {
    return typeof s === 'function' ? s() : s;
}
