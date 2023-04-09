import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable /*  */,
} from '@nestjs/common';
import { UserService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.user = user;
    } else {
      request.user = null;
    }

    return handler.handle();
  }
}
