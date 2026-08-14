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
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)

    RETURN
      p,
      collect(t) AS technologies

    ORDER BY p.name
  `);

        return result.records.map((record) => {
            const project = record.get('p').properties;

            const technologies = record
                .get('technologies')
                .filter(Boolean)
                .map((technology: any) => technology.properties);

            return {
                ...project,
                technologies,
            };
        });
    }

    async findOne(id: string) {
        const result = await this.databaseService.query(
            `
    MATCH (p:Project {id: $id})
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)

    RETURN
      p,
      collect(t) AS technologies
    `,
            { id },
        );

        if (result.records.length === 0) {
            throw new NotFoundException('Project not found');
        }

        const record = result.records[0];

        const project = record.get('p').properties;

        const technologies = record
            .get('technologies')
            .filter(Boolean)
            .map((technology: any) => technology.properties);

        return {
            ...project,
            technologies,
        };
    }
}