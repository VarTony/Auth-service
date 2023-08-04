import { Body, Controller, Post, Get, Res, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '..';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    /**
     * Аутентификация пользователя
     * 
     * @param body 
     * @param res 
     */
    // @UsePipes(new ValidationPipe({ transform: true }))
    @Get('all')
    async singInUser(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        const location = req.headers.host;
        const digitImprint = req.headers['user-agent'];

        console.log(location, digitImprint);

        const result = await this.service.findAllUsers();
        res.send({ result });
    }
}