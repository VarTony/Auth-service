/**
 * Вспомогательная функция - Приводит base64Url в нормальный формат.
 * 
 * @param b64string 
 * @returns 
 */
const replaceSpecialSymbols = b64UrlString => b64UrlString.split('')
    .map(symbol => ({ '-': '+', '_': '/' }[symbol] ?? symbol)
);

/**
 * Функция декодер для base64 строк.
 * 
 * @param value 
 * @returns 
 */
const fromBase64 = async (value: string) => Buffer.from(value, 'base64').toString ('utf-8');


/**
 * Функция декодер для base64Url строк.
 * 
 * @param value 
 * @returns 
 */
const fromBase64Url = async (value: string) => (await fromBase64(replaceSpecialSymbols(value)));


export { fromBase64, fromBase64Url };