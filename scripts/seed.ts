import 'dotenv/config';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
    process.env.COGNODB_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
        process.env.COGNODB_USER || 'cognodb',
        process.env.COGNODB_PASSWORD || 'password',
    ),
);

const technologies = [
    {
        id: 'react',
        name: 'React',
        category: 'Frontend',
        description: 'JavaScript library for building user interfaces',
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        category: 'Frontend',
        description: 'React framework for production web applications',
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        category: 'Language',
        description: 'Typed programming language built on JavaScript',
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        category: 'Language',
        description: 'Programming language for web applications',
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        category: 'Backend',
        description: 'JavaScript runtime for server-side applications',
    },
    {
        id: 'nestjs',
        name: 'NestJS',
        category: 'Backend',
        description: 'Node.js framework for scalable server applications',
    },
    {
        id: 'express',
        name: 'Express',
        category: 'Backend',
        description: 'Minimal Node.js web framework',
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        category: 'Database',
        description: 'Open-source relational database',
    },
    {
        id: 'mongodb',
        name: 'MongoDB',
        category: 'Database',
        description: 'Document-oriented NoSQL database',
    },
    {
        id: 'redis',
        name: 'Redis',
        category: 'Database',
        description: 'In-memory data structure store',
    },
    {
        id: 'docker',
        name: 'Docker',
        category: 'DevOps',
        description: 'Platform for containerizing applications',
    },
    {
        id: 'aws',
        name: 'AWS',
        category: 'Cloud',
        description: 'Cloud computing platform',
    },
    {
        id: 'graphql',
        name: 'GraphQL',
        category: 'API',
        description: 'Query language and API runtime',
    },
    {
        id: 'rest',
        name: 'REST',
        category: 'API',
        description: 'Architectural style for web APIs',
    },
    {
        id: 'tailwind',
        name: 'Tailwind',
        category: 'Frontend',
        description: 'Utility-first CSS framework',
    },
];

const projects = [
    {
        id: 'ai-dashboard',
        name: 'AI Dashboard',
        description: 'Analytics dashboard for AI-generated insights',
    },
    {
        id: 'meeting-platform',
        name: 'Meeting Platform',
        description: 'Platform for recording and analyzing online meetings',
    },
    {
        id: 'ecommerce-platform',
        name: 'E-commerce Platform',
        description: 'Online shopping platform',
    },
    {
        id: 'job-portal',
        name: 'Job Portal',
        description: 'Platform for searching and managing job applications',
    },
    {
        id: 'chat-application',
        name: 'Chat Application',
        description: 'Real-time communication application',
    },
    {
        id: 'analytics-platform',
        name: 'Analytics Platform',
        description: 'Platform for analyzing business data',
    },
    {
        id: 'crm-system',
        name: 'CRM System',
        description: 'Customer relationship management platform',
    },
    {
        id: 'content-platform',
        name: 'Content Platform',
        description: 'Platform for creating and managing content',
    },
    {
        id: 'ai-agent',
        name: 'AI Agent',
        description: 'AI-powered task automation application',
    },
    {
        id: 'developer-portfolio',
        name: 'Developer Portfolio',
        description: 'Personal developer portfolio website',
    },
];

const technologyRelationships = [
    ['react', 'nextjs'],
    ['react', 'typescript'],
    ['react', 'javascript'],
    ['react', 'tailwind'],
    ['nextjs', 'typescript'],
    ['nextjs', 'javascript'],
    ['nextjs', 'nodejs'],
    ['nextjs', 'tailwind'],
    ['nodejs', 'nestjs'],
    ['nodejs', 'express'],
    ['nodejs', 'graphql'],
    ['nodejs', 'rest'],
    ['nestjs', 'postgresql'],
    ['nestjs', 'mongodb'],
    ['nestjs', 'redis'],
    ['nestjs', 'graphql'],
    ['nestjs', 'rest'],
    ['express', 'mongodb'],
    ['express', 'postgresql'],
    ['express', 'redis'],
    ['postgresql', 'docker'],
    ['mongodb', 'docker'],
    ['redis', 'docker'],
    ['docker', 'aws'],
    ['graphql', 'react'],
    ['graphql', 'typescript'],
    ['rest', 'react'],
    ['rest', 'typescript'],
    ['typescript', 'javascript'],
    ['aws', 'docker'],
];

const projectTechnologies = [
    ['ai-dashboard', 'react'],
    ['ai-dashboard', 'nextjs'],
    ['ai-dashboard', 'typescript'],
    ['ai-dashboard', 'tailwind'],

    ['meeting-platform', 'react'],
    ['meeting-platform', 'nextjs'],
    ['meeting-platform', 'nestjs'],
    ['meeting-platform', 'postgresql'],

    ['ecommerce-platform', 'react'],
    ['ecommerce-platform', 'nextjs'],
    ['ecommerce-platform', 'typescript'],
    ['ecommerce-platform', 'postgresql'],

    ['job-portal', 'react'],
    ['job-portal', 'nextjs'],
    ['job-portal', 'nestjs'],

    ['chat-application', 'react'],
    ['chat-application', 'nestjs'],
    ['chat-application', 'redis'],

    ['analytics-platform', 'react'],
    ['analytics-platform', 'nodejs'],
    ['analytics-platform', 'postgresql'],

    ['crm-system', 'react'],
    ['crm-system', 'nestjs'],
    ['crm-system', 'mongodb'],

    ['content-platform', 'nextjs'],
    ['content-platform', 'postgresql'],
];

async function seed() {
    const session = driver.session();

    try {
        console.log('Starting CognoDB seed...\n');

        // 1. Create Technology nodes
        console.log('Creating technologies...');

        for (const technology of technologies) {
            await session.run(
                `
        MERGE (t:Technology {id: $id})
        SET
          t.name = $name,
          t.category = $category,
          t.description = $description
        `,
                {
                    id: technology.id,
                    name: technology.name,
                    category: technology.category,
                    description: technology.description,
                },
            );
        }

        console.log(`Created ${technologies.length} technologies`);

        // 2. Create Project nodes
        console.log('Creating projects...');

        for (const project of projects) {
            await session.run(
                `
        MERGE (p:Project {id: $id})
        SET
          p.name = $name,
          p.description = $description
        `,
                {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                },
            );
        }

        console.log(`Created ${projects.length} projects`);

        // 3. Create RELATED_TO relationships
        console.log('Creating RELATED_TO relationships...');

        for (const [from, to] of technologyRelationships) {
            await session.run(
                `
        MATCH (from:Technology {id: $from})
        MATCH (to:Technology {id: $to})
        MERGE (from)-[:RELATED_TO]->(to)
        `,
                {
                    from,
                    to,
                },
            );
        }

        console.log(
            `Created ${technologyRelationships.length} RELATED_TO relationships`,
        );

        // 4. Create USES relationships
        console.log('Creating USES relationships...');

        for (const [project, technology] of projectTechnologies) {
            await session.run(
                `
        MATCH (p:Project {id: $project})
        MATCH (t:Technology {id: $technology})
        MERGE (p)-[:USES]->(t)
        `,
                {
                    project,
                    technology,
                },
            );
        }

        console.log(
            `Created ${projectTechnologies.length} USES relationships`,
        );

        // 5. Verify counts
        console.log('\n🔍 Verifying graph...');

        const result = await session.run(`
      MATCH (t:Technology)
      WITH count(t) AS technologies
      MATCH (p:Project)
      WITH technologies, count(p) AS projects
      MATCH ()-[r:RELATED_TO]->()
      WITH technologies, projects, count(r) AS relatedTo
      MATCH ()-[u:USES]->()
      RETURN
        technologies,
        projects,
        relatedTo,
        count(u) AS uses
    `);

        const record = result.records[0];

        console.log(`
📊 Graph Summary
-------------------------
Technologies : ${record.get('technologies').toNumber()}
Projects     : ${record.get('projects').toNumber()}
RELATED_TO   : ${record.get('relatedTo').toNumber()}
USES         : ${record.get('uses').toNumber()}
-------------------------
`);

        console.log('🎉 Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exitCode = 1;
    } finally {
        // 6. Close connection
        await session.close();
        await driver.close();

        console.log('🔌 CognoDB connection closed');
    }
}

seed();