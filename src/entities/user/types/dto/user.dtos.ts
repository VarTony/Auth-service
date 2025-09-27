import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';


class AddUserDTO {
  @IsString()
  domain: string;

  @IsString()
  login: string;

  @IsInt()
  @Min(1)
  id: number;

  @IsInt()
  roleId?: number;

  @ValidateIf((user: AddUserDTO) => Boolean(user.email))
  @IsPhoneNumber()
  phone?: string;

  @ValidateIf((user: AddUserDTO) => Boolean(user.phone))
  @IsString()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Length(7, 256)
  password: string;
}



export { AddUserDTO };
