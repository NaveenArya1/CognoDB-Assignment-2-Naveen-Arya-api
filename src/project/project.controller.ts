import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';

import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) { }

    // GET /projects
    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    // GET /projects/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }
}