import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TelematicsService } from './telematics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Telematics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telematics')
export class TelematicsController {
  constructor(private telematicsService: TelematicsService) {}

  @Get('positions')
  async getAllPositions(@CurrentUser('profile') profile: { org_id: string }) {
    return this.telematicsService.getAllPositions(profile.org_id);
  }

  @Get('trip/:assetId')
  async getTripHistory(
    @Param('assetId') assetId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.telematicsService.getTripHistory(assetId, startDate, endDate);
  }

  @Get('alerts')
  async getAlerts(@CurrentUser('profile') profile: { org_id: string }) {
    return this.telematicsService.getAlerts(profile.org_id);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    return this.telematicsService.ingestEvent(body);
  }
}
