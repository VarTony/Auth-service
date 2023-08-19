const REDIS_CONFIG = () => ({
    redisUri: `redis:// ${ process.env.REDIS_USER }:${ process.env.REDIS_PASS }@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

export { REDIS_CONFIG };