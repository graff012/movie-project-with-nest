import { Controller, Get, Param, SetMetadata } from '@nestjs/common';
import { UserService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/auth.guard';
import { RoleGuard } from '../../common/guard/role.guard';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetMetadata('roles', ['admin', 'user', 'superadmin'])
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @SetMetadata('roles', ['admin', 'user', 'superadmin'])
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
