import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { createWorkOrderSchema, createLineItemSchema } from '@fleetpulse/shared';
import { WorkOrdersService } from './work-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private workOrdersService: WorkOrdersService) {}

  @Get()
  async findAll(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('assetId') assetId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.workOrdersService.findAll(profile.org_id, {
      status, priority, assignedTo, assetId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser('profile') profile: { org_id: string }) {
    return this.workOrdersService.getDashboard(profile.org_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Post()
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic')
  async create(
    @CurrentUser('profile') profile: { org_id: string },
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(createWorkOrderSchema)) body: any,
  ) {
    return this.workOrdersService.create(profile.org_id, user.id, body);
  }

  @Patch(':id/status')
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.workOrdersService.updateStatus(id, body.status);
  }

  @Post(':id/lines')
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic')
  async addLine(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createLineItemSchema)) body: any,
  ) {
    return this.workOrdersService.addLine(id, body);
  }

  @Delete(':id/lines/:lineId')
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic')
  async removeLine(
    @Param('id') id: string,
    @Param('lineId') lineId: string,
  ) {
    return this.workOrdersService.removeLine(id, parseInt(lineId, 10));
  }
}
