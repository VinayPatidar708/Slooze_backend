import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Re-BAC country guard — ensures a user can only touch resources
 * that belong to their own country. The resolver must attach
 * `req.targetCountryId` before this guard runs, or pass it via
 * GQL context args. We read it from the request object that the
 * resolver sets after resolving the target resource.
 */
@Injectable()
export class CountryGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    const user = req.user;

    if (!user) throw new ForbiddenException('Not authenticated');

    // targetCountryId is set by the resolver logic before access check
    const targetCountryId = req.targetCountryId;

    if (targetCountryId === undefined || targetCountryId === null) {
      // no country restriction needed for this request
      return true;
    }

    if (user.countryId !== targetCountryId) {
      throw new ForbiddenException(
        'You can only access resources within your assigned country',
      );
    }

    return true;
  }
}
