import { ExecutionContext } from '@nestjs/common';

export function requestFromContext(context: ExecutionContext) {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }
  // NOTE: just a temporary demostration what it was a graphql context
  /* else if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  } */
}
