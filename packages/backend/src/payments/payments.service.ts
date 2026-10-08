import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

import { Users } from '@prisma/client';
import { prisma } from 'config/prisma';

export type AuthedRequest = { user: Users };

// "YYYY-MM" for the given instant in Lagos time (WAT, no DST)
export function currentMonth(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
  })
    .format(now)
    .slice(0, 7);
}

@Injectable()
export class PaymentsService {
  private requireSuperAdmin(req: AuthedRequest) {
    const user = req.user;
    if (user.role !== 'SUPER_ADMIN')
      throw new ForbiddenException('only super admins can manage payments');
    return user;
  }

  // Keep 403/404 intact; wrap anything unexpected as 500
  private rethrow(error: unknown): never {
    if (error instanceof HttpException) throw error;
    console.error(error);
    throw new InternalServerErrorException(error);
  }

  async create(data: CreatePaymentDto, req: AuthedRequest) {
    try {
      const admin = this.requireSuperAdmin(req);

      const payer = await prisma.users.findUnique({
        where: { id: data.uid },
        select: { role: true },
      });
      if (!payer || payer.role === 'CLIENT')
        throw new NotFoundException('user not found');

      const payment = await prisma.payments.create({
        data: { ...data, paidAt: new Date(data.paidAt), addedBy: admin.id },
      });

      return { message: 'payment added', payment };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async fetchUserPayments(uid: string, req: AuthedRequest) {
    try {
      this.requireSuperAdmin(req);

      const payments = await prisma.payments.findMany({
        where: { uid },
        orderBy: [{ month: 'desc' }, { createdAt: 'desc' }],
        include: {
          creator: { select: { firstName: true, lastName: true } },
        },
      });

      return { payments };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async currentMonthStatus(req: AuthedRequest) {
    try {
      const user = req.user;
      const month = currentMonth();

      const count = await prisma.payments.count({
        where: { uid: user.id, month },
      });

      return { month, paid: count > 0 };
    } catch (error) {
      this.rethrow(error);
    }
  }
}
