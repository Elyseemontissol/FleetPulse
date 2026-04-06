import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { AssetsModule } from './modules/assets/assets.module';
import { WorkOrdersModule } from './modules/work-orders/work-orders.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { FuelModule } from './modules/fuel/fuel.module';
import { TelematicsModule } from './modules/telematics/telematics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SupabaseModule } from './common/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '..', '..', '..', '.env'),
        '.env',
      ],
    }),
    SupabaseModule,
    AuthModule,
    AssetsModule,
    WorkOrdersModule,
    InspectionsModule,
    MaintenanceModule,
    FuelModule,
    TelematicsModule,
    ReportsModule,
  ],
})
export class AppModule {}
