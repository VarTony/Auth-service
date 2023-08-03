const expirationToMs = (expiration: string) => expiration
 ?.split('*').reduce((time, num) => +num * time, 1);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiration = expirationToMs(process.env.ACCESS_TOKEN_EXPIRATION);
const refreshTokenExpiration = expirationToMs(process.env.REFRESH_TOKEN_EXPIRATION);
const serviceName = process.env.SERVICE_NAME;


export { 
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenExpiration,
    refreshTokenExpiration,
    serviceName
};
