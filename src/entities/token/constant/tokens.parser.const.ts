/**
 *  Разбирает токен на составные части.
 * 
 * @param token 
 * @returns 
 */
const tokensParser = async (token: string): Promise<any> => {
    const [ header, payload, signature ] = token.split('.');

    return { header, payload, signature };
}


export { tokensParser };