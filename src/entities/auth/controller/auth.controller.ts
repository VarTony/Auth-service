import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '..';
import { Response } from 'express';
import { AuthUserDTO } from '@auth/dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    /**
     * Аутентификация пользователя
     * 
     * @param body 
     * @param res 
     */
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('singIn')
    async singInUser(
        @Body() body: AuthUserDTO,
        @Res() res: Response
    ): Promise<void> {
        const { login, email, password } = body;
        
        const result = await this.service.singIn({ login, email }, password);
        res.send({ result });
    }
}
