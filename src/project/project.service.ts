import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async findAll() {
        const result = await this.databaseService.query(`
      MATCH (p:Project)
      RETURN p
      ORDER BY p.name
    `);

        return result.records.map((record) => {
            return record.get('p').properties;
        });
    }

    async findOne(id: string) {
        const result = await this.databaseService.query(
            `
      MATCH (p:Project {id: $id})
      RETURN p
      `,
            { id },
        );

        if (result.records.length === 0) {
            throw new NotFoundException('Project not found');
        }

        return result.records[0].get('p').properties;
    }
}