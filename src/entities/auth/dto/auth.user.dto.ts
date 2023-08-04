import { IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator";

class AuthUserDTO {
    @IsString()
    @Length(1, 256)
    domain: string;

    @IsInt()
    @Min(1)
    id: number;

    @IsNotEmpty()
    @IsString()
    @Length(7, 256)
    password: string;
}

export { AuthUserDTO };