import { IsEmail, IsNotEmpty, IsString, Length, ValidateIf } from "class-validator";

class AuthUserDTO {
    @IsString()
    @Length(1, 50)
    login?: string;

    @ValidateIf((user: AuthUserDTO) => Boolean(user.login))
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @Length(7, 25)
    password: string;
}

export { AuthUserDTO };