const AMQPConfig = () => ({
    amqLogin: process.env.AMQP_LOGIN,
    amqPass: process.env.AMQP_PASSWORD,
    amqHost: process.env.AMQP_HOST,
    amqPort: process.env.AMQP_PORT,
    amqMainExchange: process.env.AMQP_EXCHANGE_NAME,
  });


export { AMQPConfig };