import { IsNotEmpty, IsString, Length } from "class-validator";

class AuthUserDTO {
    @IsNotEmpty()
    @IsString()
    @Length(1, 256)
    domain: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 256)
    login: string;

    @IsNotEmpty()
    @IsString()
    @Length(7, 256)
    password: string;
}

export { AuthUserDTO };