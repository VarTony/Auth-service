import { Body, Controller, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '..';
import { Response, Request } from 'express';
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
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        const { domain, id, password } = body;

        const location = req.headers.host;
        const digitImprint = req.headers['user-agent'];
        
        const { status, result } = await this.service.singIn(domain, id, password);
        res.status(status).send({ result });
    }
}
