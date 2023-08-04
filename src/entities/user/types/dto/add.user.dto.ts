import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length, Min, ValidateIf, isInt } from "class-validator";

class AuthUserDTO {
    @IsString()
    domain: string;
    
    @IsString()
    login: string;

    @IsInt()
    @Min(1)
    id: number;

    @IsInt()
    roleId?: number;

    @ValidateIf((user: AuthUserDTO) => Boolean(user.email))
    @IsPhoneNumber()
    phone?: string;

    @ValidateIf((user: AuthUserDTO) => Boolean(user.phone))
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @Length(7, 256)
    password: string;
}

export { AuthUserDTO };