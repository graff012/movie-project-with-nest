import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAuthRegisterDto {
  @IsString()
  username: string;

  @IsString()
  fullname: string;

  @IsStrongPassword()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsOptional()
  @IsString()
  country: string;
}

export class CreateAuthLoginDto {
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
