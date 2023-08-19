const AMQP_CONFIG = () => ({
    amqLogin: process.env.AMQP_LOGIN,
    amqPass: process.env.AMQP_PASSWORD,
    amqHost: process.env.AMQP_HOST,
    amqPort: process.env.AMQP_PORT,
    amqDomainExchange: process.env.AMQP_EXCHANGE_DOMAIN_NAME,
    amqSecretExchange: process.env.AMQP_EXCHANGE_SECRET_NAME
  });


export { AMQP_CONFIG };