import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get('schedules')
  async getSchedules(@CurrentUser('profile') profile: { org_id: string }) {
    return this.maintenanceService.getSchedules(profile.org_id);
  }

  @Post('schedules')
  @Roles('admin', 'fleet_manager', 'shop_supervisor')
  async createSchedule(
    @CurrentUser('profile') profile: { org_id: string },
    @Body() body: Record<string, unknown>,
  ) {
    return this.maintenanceService.createSchedule(profile.org_id, body);
  }

  @Patch('schedules/:id')
  @Roles('admin', 'fleet_manager', 'shop_supervisor')
  async updateSchedule(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.maintenanceService.updateSchedule(id, body);
  }

  @Get('upcoming')
  async getUpcoming(@CurrentUser('profile') profile: { org_id: string }) {
    return this.maintenanceService.getUpcoming(profile.org_id);
  }

  @Post('generate')
  @Roles('admin', 'fleet_manager')
  async generateWorkOrders(@CurrentUser('profile') profile: { org_id: string }) {
    return this.maintenanceService.generateWorkOrders(profile.org_id);
  }
}
