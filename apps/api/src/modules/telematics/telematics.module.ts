import { Module } from '@nestjs/common';
import { TelematicsController } from './telematics.controller';
import { TelematicsService } from './telematics.service';
import { TelematicsGateway } from './telematics.gateway';

@Module({
  controllers: [TelematicsController],
  providers: [TelematicsService, TelematicsGateway],
  exports: [TelematicsService],
})
export class TelematicsModule {}
