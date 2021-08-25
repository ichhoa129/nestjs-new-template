import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class BaseFilterDTO {
  @Min(1)
  @Max(100)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  sort: string[];

  // TODO: Improve filtering for GET all routers
}
