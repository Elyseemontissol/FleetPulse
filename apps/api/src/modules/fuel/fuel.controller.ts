import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Fuel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fuel')
export class FuelController {
  constructor(private fuelService: FuelService) {}

  @Get('transactions')
  async findAll(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('assetId') assetId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.fuelService.findAll(profile.org_id, {
      assetId, startDate, endDate,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post('transactions')
  async create(
    @CurrentUser('profile') profile: { org_id: string },
    @Body() body: Record<string, unknown>,
  ) {
    return this.fuelService.create(profile.org_id, body);
  }

  @Get('summary')
  async getSummary(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('months') months?: string,
  ) {
    return this.fuelService.getSummary(profile.org_id, months ? parseInt(months, 10) : undefined);
  }
}
