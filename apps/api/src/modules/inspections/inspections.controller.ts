import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Inspections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inspections')
export class InspectionsController {
  constructor(private inspectionsService: InspectionsService) {}

  @Get()
  async findAll(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('assetId') assetId?: string,
    @Query('inspectorId') inspectorId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inspectionsService.findAll(profile.org_id, {
      assetId, inspectorId, status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic', 'driver')
  async create(
    @CurrentUser('profile') profile: { org_id: string },
    @CurrentUser() user: { id: string },
    @Body() body: any,
  ) {
    return this.inspectionsService.create(profile.org_id, user.id, body);
  }

  @Patch(':id/items/:itemId')
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: { status: string; severity?: string; defectDescription?: string },
  ) {
    return this.inspectionsService.updateItem(id, parseInt(itemId, 10), body);
  }

  @Post(':id/submit')
  async submit(
    @Param('id') id: string,
    @Body() body: { inspectorSignature: string; notes?: string },
  ) {
    return this.inspectionsService.submit(id, body.inspectorSignature);
  }

  @Post(':id/review')
  @Roles('admin', 'fleet_manager', 'shop_supervisor', 'mechanic')
  async review(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() body: { reviewerSignature: string; reviewerNotes?: string },
  ) {
    return this.inspectionsService.review(id, user.id, body.reviewerSignature, body.reviewerNotes);
  }

  @Post(':id/photos')
  async addPhoto(
    @Param('id') id: string,
    @Body() body: { itemId?: number; photoUrl: string; caption?: string },
  ) {
    return this.inspectionsService.addPhoto(id, body.itemId || null, body.photoUrl, body.caption);
  }
}
