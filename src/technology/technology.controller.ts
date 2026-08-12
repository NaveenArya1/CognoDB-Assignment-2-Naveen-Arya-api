import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { TechnologyService } from './technology.service';

@Controller('technologies')
export class TechnologyController {
  constructor(
    private readonly technologyService: TechnologyService,
  ) { }

  // GET /technologies
  @Get()
  findAll() {
    return this.technologyService.findAll();
  }

  // GET /technologies/:id/related
  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.technologyService.findRelated(id);
  }

  // GET /technologies/:id/ecosystem
  @Get(':id/ecosystem')
  findEcosystem(@Param('id') id: string) {
    return this.technologyService.findEcosystem(id);
  }

  // GET /technologies/:id/projects
  @Get(':id/projects')
  findProjects(@Param('id') id: string) {
    return this.technologyService.findProjects(id);
  }

  // GET /technologies/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyService.findOne(id);
  }
}