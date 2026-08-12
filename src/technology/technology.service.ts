import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class TechnologyService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  async findAll() {
    const result = await this.databaseService.query(`
      MATCH (t:Technology)
      RETURN t
      ORDER BY t.name
    `);

    return result.records.map((record) => {
      return record.get('t').properties;
    });
  }

  async findOne(id: string) {
    const result = await this.databaseService.query(
      `
      MATCH (t:Technology {id: $id})
      RETURN t
      `,
      { id },
    );

    if (result.records.length === 0) {
      throw new NotFoundException('Technology not found');
    }

    return result.records[0].get('t').properties;
  }

  async findRelated(id: string) {
    await this.findOne(id);

    const result = await this.databaseService.query(
      `
      MATCH (t:Technology {id: $id})
            -[:RELATED_TO]->
            (related:Technology)
      RETURN related
      ORDER BY related.name
      `,
      { id },
    );

    return result.records.map((record) => {
      return record.get('related').properties;
    });
  }

  async findProjects(id: string) {
    await this.findOne(id);

    const result = await this.databaseService.query(
      `
      MATCH (p:Project)-[:USES]->(t:Technology)
      WHERE t.id = $id
      RETURN p
      ORDER BY p.name
      `,
      { id },
    );

    return result.records.map((record) => {
      return record.get('p').properties;
    });
  }

  async findEcosystem(id: string) {
    await this.findOne(id);

    const result = await this.databaseService.query(
      `
      MATCH (start:Technology {id: $id})
            -[:RELATED_TO*1..2]->
            (related:Technology)

      OPTIONAL MATCH (p:Project)-[:USES]->(related)

      RETURN
        related,
        collect(p) AS projects

      ORDER BY related.name
      `,
      { id },
    );

    return result.records.map((record) => {
      const technology = record.get('related');
      const projects = record.get('projects');

      return {
        technology: technology.properties,
        projects: projects
          .filter((project) => project !== null)
          .map((project) => project.properties),
      };
    });
  }
}