import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-one";
import { UpdateUserDTO } from "./dto/update-one";
import { User } from "./index.entity";
import { UserService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { DeleteResult } from "typeorm";

@Controller("users")
export class UserController {
  constructor(public service: UserService) {}

  @Post()
  createOne(@Body() dto: CreateUserDto): Promise<User> {
    return this.service.createOne(dto);
  }

  @Get()
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.service.findOneOrFail(id);
  }

  @Patch(":id")
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return this.service.updateOne(id, dto);
  }

  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
