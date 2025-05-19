import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor() {
        super();
      }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    // 인증이 필요 없는 경로는 무조건 통과
    if (
      req.path === '/auth/login' ||
      (req.method === 'POST' && req.path === '/users/register')
    ) {
      return true;
    }
    return super.canActivate(context);
  }
}
