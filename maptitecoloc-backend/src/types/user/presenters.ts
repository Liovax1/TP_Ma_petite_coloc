import { Expose } from "class-transformer";
import { IsNumber, IsString, IsBoolean } from "class-validator";

export class UserPresenter {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  firstname: string;

  @Expose()
  @IsString()
  lastname: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsNumber()
  age: number;
}