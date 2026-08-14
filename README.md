# TechPath API

## Overview

TechPath API is a NestJS backend that uses CognoDB, a Neo4j-compatible graph database, to model relationships between technologies and projects.

The API allows users to:

- Browse technologies
- Find a technology by ID
- Discover related technologies
- Find projects using a technology
- Explore a technology ecosystem
- Find multi-hop paths between technologies

The project demonstrates how a graph database can be used for relationship-based queries and graph traversal.

---

## Tech Stack

- **Node.js**
- **NestJS**
- **TypeScript**
- **CognoDB / Neo4j-compatible graph database**
- **neo4j-driver**
- **dotenv**
- **tsx**
- **REST API**
- **Vercel** for API deployment

---

## Architecture

The application follows a simple NestJS modular architecture:

```text
Client
  │
  ▼
Vercel
  │
  ▼
NestJS Controller
  │
  ▼
Service
  │
  ▼
DatabaseService
  │
  ▼
CognoDB
```

### Modules

```text
src/
├── database/
│   ├── database.module.ts
│   └── database.service.ts
│
├── technology/
│   ├── technology.module.ts
│   ├── technology.controller.ts
│   └── technology.service.ts
│
├── project/
│   ├── project.module.ts
│   ├── project.controller.ts
│   └── project.service.ts
│
├── graph/
│   ├── graph.module.ts
│   ├── graph.controller.ts
│   └── graph.service.ts
│
└── app.module.ts
```

`DatabaseService` is responsible for managing the CognoDB connection and executing parameterized Cypher queries.

---

## Graph Model

TechPath intentionally uses a small graph model to keep the application focused on relationship traversal.

The graph contains only two node types:

```text
Technology
Project
```

---

## Nodes

### Technology

```text
Technology {
  id,
  name,
  category,
  description
}
```

Example:

```json
{
  "id": "react",
  "name": "React",
  "category": "Frontend",
  "description": "JavaScript library for building user interfaces"
}
```

### Project

```text
Project {
  id,
  name,
  description
}
```

Example:

```json
{
  "id": "ai-dashboard",
  "name": "AI Dashboard",
  "description": "Analytics dashboard for AI-generated insights"
}
```

---

## Relationships

TechPath uses two relationships.

### RELATED_TO

Connects technologies with other technologies.

```text
React
  │
  └── RELATED_TO → Next.js

Next.js
  │
  └── RELATED_TO → Node.js

Node.js
  │
  └── RELATED_TO → NestJS

NestJS
  │
  └── RELATED_TO → PostgreSQL
```

### USES

Connects projects with technologies.

```text
AI Dashboard
  ├── USES → React
  ├── USES → Next.js
  └── USES → PostgreSQL
```

---

## API Endpoints

### Technology APIs

#### Get all technologies

```http
GET /technologies
```

Returns all technologies ordered by name.

#### Get technology

```http
GET /technologies/:id
```

Example:

```http
GET /technologies/react
```

#### Get related technologies

```http
GET /technologies/:id/related
```

Example:

```http
GET /technologies/react/related
```

#### Get projects using a technology

```http
GET /technologies/:id/projects
```

Example:

```http
GET /technologies/react/projects
```

#### Get technology ecosystem

```http
GET /technologies/:id/ecosystem
```

Example:

```http
GET /technologies/react/ecosystem
```

This performs a 1–2 level graph traversal and discovers projects using the related technologies.

---

### Project APIs

#### Get all projects

```http
GET /projects
```

#### Get project

```http
GET /projects/:id
```

Example:

```http
GET /projects/ai-dashboard
```

---

### Graph API

#### Find path between technologies

```http
GET /graph/path?from=react&to=postgresql
```

The query searches for a path of 1 to 5 `RELATED_TO` relationships.

Example graph traversal:

```text
React
  ↓
Next.js
  ↓
Node.js
  ↓
NestJS
  ↓
PostgreSQL
```

---

## Health Check

The root endpoint can be used as a simple deployment check:

```http
GET /
```

Expected response:

```text
Hello World!
```

If you customize the root controller, update this example accordingly.

---

## Cypher Queries

### Get all technologies

```cypher
MATCH (t:Technology)
RETURN t
ORDER BY t.name
```

### Get technology by ID

```cypher
MATCH (t:Technology {id: $id})
RETURN t
```

### Find related technologies

```cypher
MATCH (t:Technology {id: $id})
      -[:RELATED_TO]->
      (related:Technology)
RETURN related
ORDER BY related.name
```

### Find projects using a technology

```cypher
MATCH (p:Project)-[:USES]->(t:Technology)
WHERE t.id = $id
RETURN p
ORDER BY p.name
```

### Find technology ecosystem

```cypher
MATCH (start:Technology {id: $id})
      -[:RELATED_TO*1..2]->
      (related:Technology)

OPTIONAL MATCH (p:Project)-[:USES]->(related)

RETURN
  related,
  collect(p) AS projects

ORDER BY related.name
```

### Find path between technologies

```cypher
MATCH path =
  (start:Technology {id: $from})
  -[:RELATED_TO*1..5]->
  (end:Technology {id: $to})
RETURN path
LIMIT 1
```

All dynamic values are passed as Cypher parameters rather than concatenated into query strings.

For example:

```ts
await databaseService.query(
  `
  MATCH (t:Technology {id: $id})
  RETURN t
  `,
  {
    id,
  },
);
```

---

## Environment Variables

Create a `.env` file in the project root for local development:

```env
COGNODB_URI=your_cognodb_uri
COGNODB_USER=your_cognodb_username
COGNODB_PASSWORD=your_cognodb_password
```

Example structure:

```text
project/
├── .env
├── package.json
├── src/
├── scripts/
├── vercel.json
└── README.md
```

### Production environment variables

Do **not** commit `.env` or database credentials to Git.

For Vercel, configure the variables in:

```text
Vercel Dashboard
→ Project
→ Settings
→ Environment Variables
```

Add:

```text
COGNODB_URI
COGNODB_USER
COGNODB_PASSWORD
```

Enable them for the environments you use, such as:

- Production
- Preview
- Development

---

## Setup

Clone the repository and install dependencies:

```bash
npm install
```

Configure the required environment variables in `.env`.

---

## Seed Database

The project contains a seed script:

```text
scripts/
└── seed.ts
```

The seed creates approximately:

- 15 Technology nodes
- 10 Project nodes
- 30 `RELATED_TO` relationships
- 25 `USES` relationships

Run the seed:

```bash
npm run seed
```

The seed uses parameterized Cypher queries.

---

## Run Development Server

Start the NestJS development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

Example:

```text
http://localhost:3000/technologies
```

---

## Production Build

Create a production build:

```bash
npm run build
```

NestJS generates the compiled application in:

```text
dist/
```

The production application can be started with:

```bash
npm run start:prod
```

---

## Deploy to Vercel

TechPath API can be deployed to Vercel as a NestJS backend.

Vercel provides zero-configuration support for NestJS, so the project does not need a custom `builds`, `routes`, or `outputDirectory` configuration. The included `vercel.json` intentionally contains only the Vercel schema.

### 1. Push the project to GitHub

Make sure the repository contains:

```text
package.json
src/
vercel.json
README.md
```

Do not commit:

```text
.env
```

### 2. Import the repository into Vercel

In the Vercel dashboard:

```text
New Project
→ Import Git Repository
→ Select TechPath API repository
```

Keep the project root pointed at the directory containing `package.json`.

### 3. Configure environment variables

Add the CognoDB variables in:

```text
Vercel Dashboard
→ Project
→ Settings
→ Environment Variables
```

Add:

```text
COGNODB_URI
COGNODB_USER
COGNODB_PASSWORD
```

Enable them for the environments where they are required.

Never put database credentials directly inside `vercel.json` or source code.

### 4. Configure the build

Vercel should detect the NestJS application automatically.

The project build command is:

```bash
npm run build
```

NestJS generates the compiled output in:

```text
dist/
```

Do not add a custom `outputDirectory` or rewrite all requests to `dist/main.js` when using Vercel's current NestJS support.

### 5. Deploy

Click **Deploy**.

After deployment, Vercel provides a URL similar to:

```text
https://your-project.vercel.app
```

Test the API:

```text
https://your-project.vercel.app/
https://your-project.vercel.app/technologies
https://your-project.vercel.app/projects
https://your-project.vercel.app/graph
```

Use the deployed URL as the API base URL for the TechPath frontend.

---

## Automatic Deployment

When the GitHub repository is connected to Vercel, Vercel automatically creates deployments for Git pushes and pull requests according to the project's Git settings.

Recommended production workflow:

```text
feature branch
      │
      ▼
Pull Request
      │
      ▼
Code Review
      │
      ▼
Merge → main
      │
      ▼
Vercel Production Deployment
      │
      ▼
TechPath API
```

Configure `main` as the Vercel production branch if it is not already selected.

Every new commit merged into `main` will then trigger a new production deployment.

---

## Vercel Configuration

The project intentionally uses a minimal `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

Vercel's current NestJS support handles framework detection and deployment automatically.

Avoid older configurations such as:

```json
{
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ]
}
```

or catch-all rewrites such as:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

unless you have a specific reason to use a custom serverless configuration.

---

## Frontend Integration

The TechPath frontend should use the deployed API URL instead of the local development URL.

Local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Production:

```env
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

For a Next.js frontend deployed separately, configure the production variable in the frontend hosting platform.

---

## CORS

If the frontend and API are hosted on different domains, configure CORS in the NestJS application.

Example:

```ts
app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.com",
  ],
});
```

Replace the production frontend URL with the actual deployed domain.

Do not use a wildcard origin in production when credentials or authenticated requests are involved.

---

## Error Handling

The API provides graceful error handling.

### Technology not found

```http
404 Not Found
```

Response:

```json
{
  "statusCode": 404,
  "message": "Technology not found",
  "error": "Not Found"
}
```

### Project not found

```http
404 Not Found
```

### Path not found

A missing graph path is not treated as an HTTP error.

```http
200 OK
```

Response:

```json
{
  "path": [],
  "message": "No path found"
}
```

### Database unavailable

If CognoDB cannot be reached:

```http
503 Service Unavailable
```

Response:

```json
{
  "statusCode": 503,
  "message": "Database unavailable",
  "error": "Service Unavailable"
}
```

---

## Why a Graph Database?

TechPath uses a graph database because its primary operation is exploring relationships between technologies.

In a traditional relational database, finding a multi-step relationship between technologies can require multiple joins or recursive queries. In a graph database, relationships are stored directly between nodes, making relationship traversal a natural operation.

Variable-length traversals allow the application to find paths between technologies without knowing the number of intermediate relationships beforehand.

For example:

```text
React
  ↓
Next.js
  ↓
Node.js
  ↓
NestJS
  ↓
PostgreSQL
```

The application can discover this path using:

```cypher
[:RELATED_TO*1..5]
```

without hardcoding the intermediate technologies.

The ecosystem query also demonstrates how graph traversal can be combined with project relationships:

```text
Technology
    ↓
RELATED_TO
    ↓
Related Technology
    ↓
USES
    ↓
Project
```

This makes graph databases particularly suitable for TechPath because the application's main purpose is discovering and navigating relationships between technologies and projects.

---

## Project Goals

The project demonstrates:

- Graph data modeling
- Technology-to-technology relationships
- Project-to-technology relationships
- Parameterized Cypher queries
- Variable-length graph traversal
- Multi-hop path discovery
- Technology ecosystem discovery
- REST API development with NestJS
- Database connection management
- Graceful database error handling
- Graph database use cases
- Deployment of a NestJS API to Vercel
