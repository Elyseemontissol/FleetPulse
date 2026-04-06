import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'fleet_manager', 'shop_supervisor')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('maintenance-costs')
  async getMaintenanceCosts(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getMaintenanceCosts(profile.org_id, startDate, endDate);
  }

  @Get('fuel-usage')
  async getFuelUsage(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFuelUsage(profile.org_id, startDate, endDate);
  }

  @Get('asset-utilization')
  async getAssetUtilization(@CurrentUser('profile') profile: { org_id: string }) {
    return this.reportsService.getAssetUtilization(profile.org_id);
  }

  @Get('inspection-compliance')
  async getInspectionCompliance(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('days') days?: string,
  ) {
    return this.reportsService.getInspectionCompliance(
      profile.org_id,
      days ? parseInt(days, 10) : undefined,
    );
  }
}
