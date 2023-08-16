import * as crypto from 'node:crypto';

const jwtSignatureCreator = async (
  b64Header: string,
  b64payload: string,
  secret: string,
  alg: 'sha256' | 'sha512' = 'sha512',
) => {
  const signature = crypto.createHmac(
    alg,
    `${b64Header}${b64payload}${secret}`,
  );
  return signature.digest('base64url');
};

export { jwtSignatureCreator };
