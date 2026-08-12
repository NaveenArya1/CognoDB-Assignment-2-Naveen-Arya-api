import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';

import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
    constructor(
        private readonly graphService: GraphService,
    ) { }

    @Get('path')
    findPath(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.graphService.findPath(from, to);
    }
}