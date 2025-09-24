// контракт для TS
interface IMessageBroker {
  connectSecretExchange(): Promise<void>;
  publishSecret(secret: string): Promise<void>;
}
// runtime-ключ для неста
const MESSAGE_BROKER = Symbol('MESSAGE_BROKER');


interface IMessageBrokerAdmin {
  createUser(username: string, password: string): Promise<void>;
  deleteUser(username: string): Promise<void>;
  changePassword(username: string, newPassword: string): Promise<void>;
  setPermissions(
    username: string,
    vhost: string,
    permissions: { configure: string; write: string; read: string }
  ): Promise<void>;
}
const MESSAGE_BROKER_ADMIN = Symbol('MESSAGE_BROKER_ADMIN');


export {
    IMessageBroker,
    IMessageBrokerAdmin,
    MESSAGE_BROKER,
    MESSAGE_BROKER_ADMIN
}