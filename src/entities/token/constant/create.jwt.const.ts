import { toBase64Url } from "./base64.encoder.const";
import { jwtSignatureCreator } from "./jwt.signature.creator.const";

const createJWT = async (header: any, payload: any, secret: string): Promise<string> => {
    const headerInBase64 = toBase64Url(header);
    const payloadInBase64 = toBase64Url(payload);
    const signature = jwtSignatureCreator(headerInBase64, payloadInBase64, secret);
    const jsonWebToken = [ headerInBase64, payloadInBase64, signature ].join('.');
    
    return jsonWebToken;
}


export { createJWT };