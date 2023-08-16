const expirationToMs = (expiration: string) =>
  expiration?.split('*').reduce((time, num) => +num * time, 1);

const primaryATSecret = process.env.PRIMARY_ACCESS_SECRETT;
const refreshTokenSecret = process.env.PRIMARY_REFRESH_SECRET;
const accessTokenExpiration = expirationToMs(
  process.env.ACCESS_TOKEN_EXPIRATION,
);
const refreshTokenExpiration = expirationToMs(
  process.env.REFRESH_TOKEN_EXPIRATION,
);
const serviceName = process.env.SERVICE_NAME;

export {
  primaryATSecret,
  refreshTokenSecret,
  accessTokenExpiration,
  refreshTokenExpiration,
  serviceName,
};
