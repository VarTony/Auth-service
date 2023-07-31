/**
 * Функция диспатчер переводящее значение в base64 кодировку
 * 
 * @param value 
 * @returns 
 */
const toBase64 = value => ({
    string: Buffer.from(value).toString ('base64'),
    object: Buffer.from(JSON.stringify(value)).toString ('base64')
}[typeof value]);


export { toBase64 };