import { IsNotEmpty, IsString, Length } from 'class-validator';

class JWTUpdateQueryStirng {
    @IsNotEmpty()
    @IsString()
    @Length(240, 240)
    public rt: string;
}

export { JWTUpdateQueryStirng };