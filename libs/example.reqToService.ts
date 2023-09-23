import * as amqp from 'amqplib';
import crypto from 'node:crypto';



async function externalService() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const replyQueue = await channel.assertQueue('', { exclusive: true });

  const domain = {
    host: '192.153.54.11',
    name: 'exampleService',
    passhash: '*****', // Передавайте реальные хеши паролей только через защищенный канал
    salt: '*****', // Передавайте реальные значения salt только через защищенный канал
    secret: 'securesecret', // Это поле также следует обезопасить
  };

  // Сериализация объекта domain в JSON строку
  const message = JSON.stringify(domain);

  const exchange = 'domain';
  const routingKey = 'rpc_queue';
  // Генерируем уникальный идентификатор для сообщения
  const correlationId = crypto.randomUUID();


  // Отправляем сообщение в очередь
  channel.sendToQueue(routingKey, Buffer.from(message), {
    correlationId, // Отправляем идентификатор связи
    replyTo: replyQueue.queue, // Указываем, куда отправить ответ
  });

  // Потребляем (получаем) сообщения из очереди ответов
  channel.consume(
    replyQueue.queue,
    (msg) => {
      // Проверяем, совпадает ли идентификатор связи с оригинальным сообщением
      if (msg.properties.correlationId === correlationId) {
        // Выводим содержимое полученного сообщения
        console.log(' [.] Got %s', msg.content.toString());
        
        // Закрываем канал и соединение после получения ответа
        channel.close();
        connection.close();
      }
    }
  );
}


externalService();

