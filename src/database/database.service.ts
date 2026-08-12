import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import neo4j, {
    Driver,
    Session,
    QueryResult,
} from 'neo4j-driver';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly driver: Driver;

    constructor() {
        this.driver = neo4j.driver(
            process.env.COGNODB_URI!,
            neo4j.auth.basic(
                process.env.COGNODB_USERNAME!,
                process.env.COGNODB_PASSWORD!,
            ),
        );
    }

    async onModuleInit(): Promise<void> {
        await this.connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.close();
    }

    async connect(): Promise<void> {
        await this.driver.verifyConnectivity();
        console.log('Connected to CognoDB');
    }

    getSession(): Session {
        return this.driver.session();
    }

    async executeQuery<T = unknown>(
        query: string,
        parameters: Record<string, unknown> = {},
    ): Promise<QueryResult> {
        const session = this.getSession();

        try {
            return await session.run(query, parameters);
        } finally {
            await session.close();
        }
    }

    async close(): Promise<void> {
        await this.driver.close();
    }
}