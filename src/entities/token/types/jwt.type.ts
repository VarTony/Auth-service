type JWTHeader = {
  alg: string;
  typ: string;
};

type JWTPayload = {
  uid: number;
  jti: number;
  iat: Date;
  exp: Date;
  iss: string;
};

type JWTPair = {
  refreshToken: string;
  accessToken: string;
};

export { JWTHeader, JWTPair, JWTPayload };
