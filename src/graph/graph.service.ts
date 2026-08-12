import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class GraphService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async findPath(from: string, to: string) {
        const result = await this.databaseService.query(
            `
      MATCH path =
        (start:Technology {id: $from})
        -[:RELATED_TO*1..5]->
        (end:Technology {id: $to})
      RETURN path
      LIMIT 1
      `,
            {
                from,
                to,
            },
        );

        if (result.records.length === 0) {
            return {
                path: [],
                message: 'No path found',
            };
        }

        const path = result.records[0].get('path');

        const nodes = [
            path.start,
            ...path.segments.map((segment) => segment.end),
        ];

        return {
            from,
            to,
            found: true,
            hops: path.length,
            path: nodes.map((node) => ({
                id: node.properties.id,
                name: node.properties.name,
                category: node.properties.category,
            })),
        };
    }
}