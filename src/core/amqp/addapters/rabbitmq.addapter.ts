import { AMQP_CONFIG } from '@config/amqp.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, Connection, ConsumeMessage, Options } from 'amqplib';

type ExchangeType = 'direct' | 'topic' | 'fanout' | 'headers';

@Injectable()
class RabbitMQAdapter {
  private connection: Connection | null = null;
  private readonly uri: string;

  /**
   * Конструктор адаптера RabbitMQ.
   * @param url - URL-адрес для подключения к RabbitMQ.
   */
  constructor(private configService: ConfigService) {
    this.uri = this.configService.get<string>('amqURI');
  }

  /**
   * Устанавливает соединение с RabbitMQ и создает канал.
   */
  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.uri);
    } catch (error) {
      console.error('Unable to connect to RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Создает канал для связи с RabbitMQ.
   * @returns {Promise<Channel>} Возвращает Promise, который разрешается созданным каналом.
   */
  async createChannel(): Promise<Channel> {
    try {
      const channel = await this.connection.createChannel();
      return channel;
    } catch (err) {
      console.error('Unable to create a channel:', err);
      throw err;
    }
  }

  /**
   * Закрывает предоставленный канал связи с RabbitMQ.
   * @param channel - Канал, который нужно закрыть.
   * @returns {Promise<void>} Возвращает Promise, который разрешается, когда канал закрыт.
   */
  async closeChannel(channel: Channel): Promise<void> {
    try {
      await channel.close();
    } catch (err) {
      console.error('Unable to close the channel:', err);
      throw err;
    }
  }

  /**
   * Объявляет очередь.
   * @param queue - Имя очереди.
   * @param options - Опции очереди.
   */
  async declareQueue(
    channel: Channel,
    queue: string,
    options?: Options.AssertQueue,
  ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    await channel.assertQueue(queue, options); // Объявление очереди.
  }

  /**
   * Объявляет обменник.
   * @param exchange - Имя обменника.
   * @param type - Тип обменника.
   * @param options - Опции обменника.
   */
  async declareExchange(
    channel: Channel,
    exchange: string,
    type: ExchangeType,
    options?: Options.AssertExchange,
  ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    await channel.assertExchange(exchange, type, options); // Объявление обменника.
  }

  /**
   * Привязывает очередь к обменнику.
   * @param queue - Имя очереди.
   * @param exchange - Имя обменника.
   * @param routingKey - Ключ маршрутизации.
   */
  async bindQueuesToExchange(
    channel: Channel,
    queues: string[],
    exchange: string,
    routingKey: string = '',
  ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    await Promise.all(
      // Привязка очередей к обменнику.
      queues.map(
        async (queue) => await channel.bindQueue(queue, exchange, routingKey),
      ),
    );
  }

  /**
   * Публикует сообщение в очередь.
   * @param queue - Имя очереди.
   * @param message - Сообщение.
   */
  async publishToQueue(
    channel: Channel,
    queue: string,
    message: string,
  ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    channel.sendToQueue(queue, Buffer.from(message)); // Публикация сообщения в очередь.
  }

  /**
   * Публикует сообщение в обменник.
   * @param exchange - Имя обменника.
   * @param routingKey - Ключ маршрутизации.
   * @param message - Сообщение.
   */
  async publishToExchange(
    channel: Channel,
    exchange: string,
    message: string,
    routingKey: string = '',
  ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    channel.publish(exchange, routingKey, Buffer.from(message)); // Публикация сообщения в обменник.
  }

  /**
   * Устанавливает соединение с RabbitMQ с автоматическим восстановлением.
   * При обрыве соединения или ошибке адаптер предпримет повторные попытки подключения.
   *
   * @param retries - Максимальное количество попыток переподключения (по умолчанию 5).
   * @param delay - Задержка между попытками переподключения в миллисекундах (по умолчанию 3000 мс).
   * @returns {Promise<void>} Возвращает Promise, который разрешается после успешного подключения.
   */
  async connectWithRetry(
    retries: number = 5,
    delay: number = 3000,
  ): Promise<void> {
    let attempts = 0;

    const connect = async () => {
      try {
        this.connection = await amqp.connect(this.uri);

        console.log('Connected to RabbitMQ');

        // Подписка на событие закрытия соединения
        this.connection.on('close', async () => {
          console.error('RabbitMQ connection closed. Reconnecting...');
          await reconnect();
        });

        // Подписка на событие ошибки соединения
        this.connection.on('error', async (err) => {
          console.error('RabbitMQ connection error:', err);
        });
      } catch (error) {
        console.error(`Connection attempt ${attempts + 1} failed:`, error);
        throw error;
      }
    };

    const reconnect = async () => {
      if (attempts >= retries) {
        console.error('Max reconnect attempts reached. Giving up.');
        return;
      }
      attempts++;
      console.log(
        `Reconnecting in ${delay / 1000} seconds... (attempt ${attempts})`,
      );
      await new Promise((res) => setTimeout(res, delay));
      await connect();
    };

    await connect();
  }

  /**
   * Подписывается на сообщения из очереди с поддержкой подтверждений (ack/nack).
   * Если обработка сообщения завершается успешно — вызывается ack.
   * Если при обработке возникает ошибка — вызывается nack.
   *
   * @param channel - Канал RabbitMQ, в котором осуществляется подписка.
   * @param queue - Имя очереди, из которой будут поступать сообщения.
   * @param callback - Асинхронный коллбэк, вызываемый при получении сообщения.
   *                   Должен содержать логику обработки сообщения.
   * @param options - Опции потребителя (по умолчанию { noAck: false }, то есть включены подтверждения).
   * @returns {Promise<void>} Возвращает Promise, который разрешается после регистрации подписки.
   */
  async consume(
    channel: Channel,
    queue: string,
    callback: (msg: ConsumeMessage) => Promise<void>,
    options: Options.Consume = { noAck: false },
  ): Promise<void> {
    await channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;
        try {
          await callback(msg); // Вызов пользовательского обработчика
          if (!options.noAck)
            channel.ack(msg); // Подтверждаем успешную обработку
        } catch (err) {
          console.error('Error processing message:', err);
          if (!options.noAck)
            channel.nack(msg, false, true); // Отправляем сообщение обратно в очередь
        }
      },
      options,
    );
  }

  /**
   * Закрывает соединение с RabbitMQ.
   */
  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export { RabbitMQAdapter };
