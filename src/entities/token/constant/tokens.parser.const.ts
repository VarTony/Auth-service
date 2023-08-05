import { JWTHeader, JwtPayload } from "@token/types";
import { fromBase64Url } from "./base64.decoder.const";

type DataFromTokenParser = {
    str: { header: string, payload: string, signature: string },
    map: {
        header: JWTHeader,
        payload: JwtPayload
    }
}


/**
 *  Разбирает токен на составные части.
 * 
 * @param token 
 * @returns 
 */
const tokensParser = async (token: string): Promise<DataFromTokenParser> => {
    const [ header, payload, signature ] = token.split('.');
    

    return { 
        str: { header, payload, signature },
        map: { 
            header: JSON.parse(await fromBase64Url(header)),
            payload: JSON.parse(await fromBase64Url(payload))
        }
    };
}


export { tokensParser };