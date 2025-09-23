/**
 * Вспомогательная функция - Форматирует base64 строку под url формат.
 *
 * @param b64string
 * @returns
 */
const replaceSpecialSymbols = (b64string: string) =>
  b64string
    .split('')
    .map((symbol) => ({ '=': '', '+': '-', '/': '_' }[symbol] ?? symbol));

/**
 * Функция диспатчер - Переводит значение в base64 кодировку.
 *
 * @param value
 * @returns
 */
const toBase64 = (value: string | object) => ({
    string: () => Buffer.from(value as string).toString('base64'),
    object: () => Buffer.from(JSON.stringify(value)).toString('base64'), // Без проброса через функцию ломается из-за неподходящего типа данных, почему??? 
  }[(typeof value)]());

/**
 * Функция обертка - Переводит строку base64 в пригодное для url значение.
 *
 * @param value
 * @returns
 */
const toBase64Url = (value: object | string) => replaceSpecialSymbols(toBase64(value));

export { toBase64, toBase64Url };
