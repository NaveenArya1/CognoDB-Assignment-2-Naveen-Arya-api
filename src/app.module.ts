import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TechnologyModule } from './technology/technology.module';
import { ProjectModule } from './project/project.module';
import { GraphModule } from './graph/graph.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), DatabaseModule, TechnologyModule, ProjectModule, GraphModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
