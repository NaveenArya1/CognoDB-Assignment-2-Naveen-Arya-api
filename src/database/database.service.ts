import 'dotenv/config';

import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
    ServiceUnavailableException,
} from '@nestjs/common';

import neo4j, {
    Driver,
    QueryResult,
} from 'neo4j-driver';

@Injectable()
export class DatabaseService
    implements OnModuleInit, OnModuleDestroy {
    private readonly driver: Driver;

    constructor() {
        const uri = process.env.COGNODB_URI;
        const username = process.env.COGNODB_USERNAME;
        const password = process.env.COGNODB_PASSWORD;
        console.log('🌱 Starting CognoDB service...\n', uri, username, password)

        if (!uri || !username || !password) {
            throw new Error(
                'Missing CognoDB environment variables',
            );
        }

        this.driver = neo4j.driver(
            uri,
            neo4j.auth.basic(username, password),
        );
    }

    async onModuleInit() {
        try {
            await this.driver.verifyConnectivity();

            console.log('✅ Connected to CognoDB');
        } catch (error) {
            console.error('❌ CognoDB connection failed:', error);

            throw new ServiceUnavailableException(
                'Database unavailable',
            );
        }
    }

    async query(
        cypher: string,
        params: Record<string, unknown> = {},
    ): Promise<QueryResult> {
        const session = this.driver.session();

        try {
            return await session.run(cypher, params);
        } catch (error) {
            console.error('❌ CognoDB query failed:', error);

            throw new ServiceUnavailableException(
                'Database unavailable',
            );
        } finally {
            await session.close();
        }
    }

    async onModuleDestroy() {
        await this.driver.close();

        console.log('🔌 CognoDB connection closed');
    }
}