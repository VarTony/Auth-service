const SECRET_CONFIG = () => ({
    tempAccessSecretLivetimeInMs: +process.env.TEMP_ACCESS_SECRET_LIVETIME_IN_MS ?? 18000000
});

export { SECRET_CONFIG };