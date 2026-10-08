import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt-auth.guard';
import { AuthedRequest, PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

// Verifies the JWT signature; sets req.user
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: AuthedRequest,
  ) {
    return this.paymentsService.create(createPaymentDto, req);
  }

  @Get('/me/current')
  currentMonthStatus(@Request() req: AuthedRequest) {
    return this.paymentsService.currentMonthStatus(req);
  }

  @Get('/user/:id')
  findByUser(@Param('id') id: string, @Request() req: AuthedRequest) {
    return this.paymentsService.fetchUserPayments(id, req);
  }
}
