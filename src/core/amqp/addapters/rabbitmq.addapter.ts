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
  async declareQueue(channel: Channel, queue: string, options?: Options.AssertQueue): Promise<void> {
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
    options?: Options.AssertExchange
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
    routingKey: string = ''
    ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    await Promise.all(
      // Привязка очередей к обменнику.
      queues.map(async queue =>  await channel.bindQueue(queue, exchange, routingKey))
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
    message: string
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
    routingKey: string = ''
    ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    channel.publish(exchange, routingKey, Buffer.from(message)); // Публикация сообщения в обменник.
  }

  /**
   * Подписывается на сообщения из очереди.
   * @param queue - Имя очереди.
   * @param callback - Коллбэк, вызываемый при получении сообщения.
   */
  async consume(
    channel: Channel,
    queue: string,
    callback: (msg: ConsumeMessage | null) => void
    ): Promise<void> {
    if (!channel) throw new Error('Not connected to RabbitMQ'); // Проверка наличия канала.
    await channel.consume(queue, callback); // Подписка на сообщения из очереди.
  }
}

export { RabbitMQAdapter };
