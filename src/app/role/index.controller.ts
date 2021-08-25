import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Role } from "./index.entity";
import { RoleService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";

@Controller("roles")
export class RoleController {
  constructor(public service: RoleService) {}

  @Get()
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.service.findOneOrFail(id);
  }
}
