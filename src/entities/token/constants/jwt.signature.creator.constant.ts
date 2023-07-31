import * as crypto from 'node:crypto';


const jwtSignatureCreator = (b64Header: string, b64payload: string, secret: string, alg: string = 'sha256') => {
    const signature = crypto.createHmac(alg, `${b64Header}${b64payload}${secret}`);
    return signature.digest('base64url');
}


export { jwtSignatureCreator };