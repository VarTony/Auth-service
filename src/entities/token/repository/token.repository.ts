import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RefreshToken } from './refresh.token.model';

@Injectable()
export class TokenRepository extends Repository<RefreshToken> {
  constructor(private readonly dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  /**
   * Создать запись о новом refresh-токене.
   */
  async createToken(
    userId: number,
    location: string,
    userAgent: string,
  ): Promise<RefreshToken> {
    const entity = this.create({
      userId,
      token: 'plug',
      isActive: true,
      location,
      userAgent,
    });
    return await this.save(entity);
  }

  /**
   * Обновить токен по id.
   */
  async updateTokenValue(id: number, token: string): Promise<void> {
    await this.update({ id }, { token });
  }

  /**
   * Очистка отношения от картежей с данными деактивированнх токенов
   */
  async deleteInactiveTokens(): Promise<void> {
    await this.delete({ isActive: false });
  }

  /**
   * Найти токен по id.
   */
  async findById(id: number): Promise<RefreshToken | null> {
    return this.findOne({ where: { id } });
  }

  /**
   * Удалить все неактивные токены.
   */
  async deleteInactive(): Promise<void> {
    await this.delete({ isActive: false });
  }
}
