// 代码生成时间: 2025-08-30 23:20:37
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// Define the roles that can be assigned to resources
export enum ROLES {
# NOTE: 重要实现细节
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
# 改进用户体验

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredRoles = this.reflector.get<ROLES[]>('roles', context.getHandler());
# 改进用户体验
    if (!requiredRoles) {
      return true;
    }
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
# 扩展功能模块
    if (!hasRole) {
      throw new UnauthorizedException('You do not have permission to access this resource.');
    }
    return true;
# TODO: 优化性能
  }
}
# FIXME: 处理边界情况

// Usage of the @UseGuards decorator to apply the guard to a controller or handler
// @UseGuards(RolesGuard)

// Example of a controller method using the Roles decorator to require a specific role
// @SetMetadata('roles', [ROLES.ADMIN])
// getAdminData(): string {
//   return 'Admin data';
// }