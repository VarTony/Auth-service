type JWTHeader = {
  alg: string;
  type: string;
};

type JWTPayload = {
  uid: number;
  nuid?: number;
  roles?: number | 'roleId';
  dmn?: string;
  jti: number;
  iat?: Date | number;
  exp: Date | number;
  iss: string;
};

type JWTPair = {
  refreshToken: string;
  accessToken: string;
};

export { JWTHeader, JWTPair, JWTPayload };
