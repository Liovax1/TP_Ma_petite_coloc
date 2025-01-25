import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, Min } from "class-validator";

export class UserToCreateDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Expose()
  @IsInt()
  @Min(18)
  age: number;
}