import { IsNotEmpty, IsString, Length } from 'class-validator';

class JWRTQueryStirng {
    @IsNotEmpty()
    @IsString()
    @Length(240, 240)
    public rt: string;
}

export { JWRTQueryStirng };