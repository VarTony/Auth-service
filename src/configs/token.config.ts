const TOKEN_CONFIG = () => ({
    primaryATSecret: process.env.PRIMARY_ACCESS_SECRETT,
    refreshTokenSecret: process.env.PRIMARY_REFRESH_SECRET,
    accessTokenExpiration: +process.env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: +process.env.REFRESH_TOKEN_EXPIRATION,
    serviceName: process.env.SERVICE_NAME
});

export { TOKEN_CONFIG };