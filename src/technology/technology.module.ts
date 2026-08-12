import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TechnologyController],
  providers: [TechnologyService],
})
export class TechnologyModule {}
