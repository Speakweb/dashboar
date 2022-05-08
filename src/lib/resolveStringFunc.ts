import {StringOrStringFunc} from "./config";

export const resolveStringFunc = (s: StringOrStringFunc) => {
    return typeof s === 'function' ? s() : s;
}
