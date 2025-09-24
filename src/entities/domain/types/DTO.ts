import { IsString, IsNotEmpty } from 'class-validator';

class CreateDomainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  firstPartOfsecret: string;

  @IsString()
  host: string;
}



export { CreateDomainDto }