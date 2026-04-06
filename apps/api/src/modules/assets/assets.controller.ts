import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { createAssetSchema, updateAssetSchema } from '@fleetpulse/shared';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Get()
  async findAll(
    @CurrentUser('profile') profile: { org_id: string },
    @Query('status') status?: string,
    @Query('type') assetType?: string,
    @Query('category') category?: string,
    @Query('department') department?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.assetsService.findAll(profile.org_id, {
      status,
      assetType,
      category,
      department,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'fleet_manager')
  @UsePipes(new ZodValidationPipe(createAssetSchema))
  async create(
    @CurrentUser('profile') profile: { org_id: string },
    @Body() body: unknown,
  ) {
    return this.assetsService.create(profile.org_id, body as any);
  }

  @Patch(':id')
  @Roles('admin', 'fleet_manager')
  @UsePipes(new ZodValidationPipe(updateAssetSchema))
  async update(@Param('id') id: string, @Body() body: unknown) {
    return this.assetsService.update(id, body as any);
  }

  @Post(':id/meter')
  async recordMeter(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() body: { type: 'odometer' | 'hours'; value: number },
  ) {
    return this.assetsService.recordMeter(id, body.type, body.value, user.id);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.assetsService.getHistory(id);
  }
}
