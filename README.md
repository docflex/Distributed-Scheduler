# Distributed Scheduler

A production-ready, cloud-native distributed scheduling system built with **Spring Boot 3**, **Quartz**, and **PostgreSQL**.

## Overview

This project implements a **Distributed, Multi-Node, Database-Backed Scheduler** that solves the core problem of running scheduled tasks reliably across multiple instances in a distributed system.

Core Features

- **Exactly-Once Execution**: Guarantees only one node executes a job at a time across the cluster using database-backed locking
- **Database-Backed Persistence**: All job definitions and execution history persisted to PostgreSQL
- **Dynamic Job Management**: Create, update, pause, resume, and delete jobs via GraphQL API at runtime
- **Multiple Schedule Types**: Support for CRON, FIXED_RATE, and FIXED_DELAY scheduling
- **Execution Logging**: Complete audit trail of all job executions with status and error tracking
- **Cluster-Safe**: Built on Quartz in cluster mode with automatic failover and recovery
- **Smart Reconciliation**: Automatically repairs scheduler state on node startup
- **GraphQL API**: Type-safe, fully-featured API for job management and observability
- **Load Balancing**: NGINX load balancer distributes traffic across multiple scheduler instances
- **Dynamic Instance Scaling**: Auto-scaling support with Eureka service discovery for instance registration/deregistration
- **Horizontally Scalable**: Add or remove scheduler instances without code changes or downtime

---
## UI Dashboard

The project includes a fully interactive **web UI dashboard** built using:

* **React + Vite**
* **Apollo GraphQL**
* **React Query**
* **TailwindCSS + ShadCN UI**
* **NGINX static hosting**
* **Docker Compose deployment**

The UI provides complete visibility and control over the distributed scheduler cluster.

---

### Job List

Shows all scheduled jobs with real-time status, schedule type, timestamps, and actions (Run Now, Pause, Resume, Delete, View Logs).

**Screenshot:**

<img width="1440" height="447" alt="Screenshot 2025-11-30 at 12 39 30 PM" src="https://github.com/user-attachments/assets/2d536a67-402a-429f-ac13-cf71132251ba" />

---

### Create Job

Supports all schedule types:

* CRON
* FIXED_RATE
* FIXED_DELAY

It includes dynamic form fields, a JSON payload editor, and validation.

**Screenshot:**

<img width="1440" height="496" alt="Screenshot 2025-11-30 at 12 35 22 PM" src="https://github.com/user-attachments/assets/5d3a492f-cf67-4a36-8f58-3ce40f9ffbe2" />

---

### Execution Logs Screen

Displays execution history for a job including:

* Fire time
* Status (SUCCESS / FAILED)
* Error message (if any)

**Screenshot:**

<img width="1440" height="345" alt="Screenshot 2025-11-30 at 12 40 51 PM" src="https://github.com/user-attachments/assets/07ae8eab-f760-4555-bdf6-7f157723529a" />


---

## Why Not Spring's @Scheduled?

Traditional in-memory schedulers fail in distributed environments:

| Problem | @Scheduled | Distributed Scheduler |
|---------|-----------|----------------------|
| **Execution Count** | Runs on every node (duplicates) | Exactly-once execution |
| **Job Persistence** | Lost on restart | Persisted to database |
| **Dynamic Management** | Can't add/remove jobs at runtime | Full GraphQL API |
| **Execution History** | No audit trail | Complete execution logs |
| **Cluster Awareness** | No consensus mechanism | DB-backed distributed locking |
| **Scalability** | Not designed for clusters | Horizontally scalable |
| **Observability** | Limited visibility | Query job status & history |

---

## Architecture

### High-Level Design

```
                      +------------------------+
                      |   GraphQL API Layer    |
                      +-----------+------------+
                                  |
                                  v
               +---------------------------------------+
               |     Application Services (Use Cases)  |
               |  - CreateJobService                   |
               |  - PauseJobService                    |
               |  - ResumeJobService                   |
               |  - DeleteJobService                   |
               |  - RunJobNowService                   |
               +--------------------+-------------------+
                                   |
      +----------------------------+-----------------------------+
      |                                                          |
      v                                                          v
+---------------------------+              +----------------------+
| Persistence Layer         |              | Quartz Integration   |
| - JobRepository           |              | - QuartzScheduler    |
| - ExecutionLogRepository  |              | - ReconciliationSvc  |
| - Domain Models           |              |                      |
| - JPA Entities            |              | Database Locking:    |
+---------------------------+              | - Cluster leadership |
      |                                    | - Failover handling  |
      v                                    | - Misfire policies   |
+---------------------------+              +----------------------+
| PostgreSQL Database       |                     |
| - job_definition          |                     |
| - job_execution_log       |                     |
| - QRTZ_* (Quartz tables)  |<-------------------+
+---------------------------+
```

### Design Patterns

- **Hexagonal Architecture**: Clear separation between API, application, domain, and infrastructure layers
- **Domain-Driven Design**: Rich domain models (JobDefinition, JobExecutionLog) with business logic
- **Repository Pattern**: Data access abstraction via repository interfaces
- **Adapter Pattern**: Quartz scheduler integrated via dedicated QuartzSchedulingAdapter
- **Service Layer**: Application services orchestrate between domain and infrastructure

### Directory Structure

```
scheduler-instance/
├── src/main/java/com/example/scheduler/
│   ├── DistributedSchedulerApplication.java    # Spring Boot entry point
│   ├── api/
│   │   └── graphql/                            # GraphQL controllers
│   ├── application/
│   │   ├── dto/                                # DTOs for API
│   │   ├── mapper/                             # Entity ↔ DTO mapping
│   │   └── service/                            # Application services
│   ├── domain/
│   │   ├── model/                              # JobDefinition, JobExecutionLog
│   │   └── port/                               # Repository interfaces
│   ├── infrastructure/
│   │   ├── persistence/                        # JPA entities, repositories
│   │   └── quartz/                             # Quartz scheduler, adapter
│   └── config/                                 # Spring configuration
├── src/main/resources/
│   ├── application.yml                         # Spring Boot config
│   ├── graphql/jobs.graphqls                   # GraphQL schema
│   └── db/migration/                           # Flyway migrations
└── pom.xml                                     # Maven dependencies
```

---

## Data Model

### job_definition Table

Stores the definition of each scheduled job:

```sql
CREATE TABLE job_definition (
    id                    UUID PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    schedule_type         VARCHAR(50) NOT NULL,     -- CRON, FIXED_RATE, FIXED_DELAY
    cron_expression       VARCHAR(255),             -- for CRON jobs
    interval_seconds      BIGINT,                   -- for FIXED_RATE/FIXED_DELAY
    initial_delay_seconds BIGINT,                   -- for FIXED_DELAY
    payload               JSONB,                    -- custom job data
    status                VARCHAR(32) NOT NULL,     -- ACTIVE, PAUSED, DELETED
    version               INTEGER DEFAULT 0,        -- for optimistic locking
    created_at            TIMESTAMP DEFAULT now(),
    updated_at            TIMESTAMP DEFAULT now()
);
```

### job_execution_log Table

Tracks every execution of every job:

```sql
CREATE TABLE job_execution_log (
    id             UUID PRIMARY KEY,
    job_id         UUID NOT NULL,
    fire_time      TIMESTAMP NOT NULL,
    status         VARCHAR(32) NOT NULL,     -- SUCCESS, FAILED
    error_message  TEXT,
    created_at     TIMESTAMP DEFAULT now()
);
```

### Quartz Tables

Standard Quartz cluster schema (managed by Flyway migration V1):
- `QRTZ_JOBS` - Job details
- `QRTZ_TRIGGERS` - Trigger definitions
- `QRTZ_CALENDARS` - Calendar exclusions
- `QRTZ_LOCKS` - Distributed locking for cluster coordination
- And 7+ more tables for complete cluster support

---

## GraphQL API

### Complete Schema

All endpoints are at `POST /scheduler-instance/graphql`

#### Queries

```graphql
type Query {
  """List all jobs"""
  jobs: [Job!]!
  
  """Get a single job by ID"""
  job(id: ID!): Job
  
  """Get execution logs for a job"""
  jobLogs(jobId: ID!): [JobExecutionLog!]!
}
```

#### Mutations

```graphql
type Mutation {
  """Create and schedule a job"""
  createJob(input: CreateJobInput!): Job!
  
  """Pause a job (stops execution, keeps definition)"""
  pauseJob(id: ID!): Job!
  
  """Resume a paused job"""
  resumeJob(id: ID!): Job!
  
  """Delete a job and unschedule it"""
  deleteJob(id: ID!): Boolean!
  
  """Fire a job immediately on the cluster"""
  runJobNow(id: ID!): Boolean!
}
```

#### Types

```graphql
enum JobScheduleType {
  CRON
  FIXED_RATE
  FIXED_DELAY
}

enum JobStatus {
  ACTIVE
  PAUSED
  DELETED
}

type Job {
  id: ID!
  name: String!
  scheduleType: JobScheduleType!
  cronExpression: String
  intervalSeconds: Int
  initialDelaySeconds: Int
  payload: String
  status: JobStatus!
  version: Int!
  createdAt: String
  updatedAt: String
}

type JobExecutionLog {
  id: ID!
  jobId: ID!
  fireTime: String!
  status: String!
  errorMessage: String
  createdAt: String!
}

input CreateJobInput {
  name: String!
  scheduleType: JobScheduleType!
  cronExpression: String
  intervalSeconds: Int
  initialDelaySeconds: Int
  payload: JSON
}
```

### Example Requests

**Create a CRON Job**

```graphql
mutation CreateJob($input: CreateJobInput!) {
  createJob(input: $input) {
    id
    name
    scheduleType
    cronExpression
    status
  }
}
```

Variables:
```json
{
  "input": {
    "name": "Daily Report Generation",
    "scheduleType": "CRON",
    "cronExpression": "0 2 * * *",
    "payload": {
      "reportType": "daily",
      "recipients": ["admin@example.com"]
    }
  }
}
```

**List All Jobs**

```graphql
query {
  jobs {
    id
    name
    scheduleType
    status
  }
}
```

**Get Job Execution History**

```graphql
query GetLogs($jobId: ID!) {
  jobLogs(jobId: $jobId) {
    id
    fireTime
    status
    errorMessage
  }
}
```

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- PostgreSQL 14+ (or use Docker)

### Quick Start with Docker

1. **Clone and navigate to the project:**
   ```bash
   cd distributed-scheduler
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

   This starts:
   - PostgreSQL (port 5432)
   - Eureka Service Registry (port 8761)
   - Multiple Scheduler Instances (port 8081+)
   - NGINX Load Balancer (port 80)

3. **Access the GraphQL playground:**
   ```
   http://localhost:8081/scheduler-instance/graphql
   ```

4. **Create a test job:**
   ```bash
   curl -X POST http://localhost:8081/scheduler-instance/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation { createJob(input: {name: \"Test Job\", scheduleType: CRON, cronExpression: \"0/10 * * * * ?\", payload: {type: \"test\"}}) { id name status } }"
     }'
   ```

### Running Locally (Without Docker)

1. **Start PostgreSQL:**
   ```bash
   # If using Homebrew on macOS
   brew services start postgresql
   
   # Create the database
   createdb -U postgres scheduler
   ```

2. **Configure PostgreSQL connection:**
   - Edit `scheduler-instance/src/main/resources/application.yml`
   - Update datasource URL, username, password

3. **Build the project:**
   ```bash
   mvn clean package
   ```

4. **Run the scheduler:**
   ```bash
   java -jar scheduler-instance/target/distributed-scheduler-1.0-SNAPSHOT.jar \
     --spring.profiles.active=local
   ```

5. **Access GraphQL:**
   ```
   http://localhost:8081/scheduler-instance/graphql
   ```

---

## Configuration

### Environment Profiles

**Docker Profile** (`docker`):
- Uses PostgreSQL at `postgres:5432`
- Registers with Eureka at `eureka:8761`
- Enables clustering

**Local Profile** (`local`):
- Uses local PostgreSQL at `localhost:5432`
- Disables Eureka registration (single instance)
- Useful for development

### Key Configuration Properties

```yaml
server.port: 8081                                    # Server port
spring.datasource.url: jdbc:postgresql://...         # Database URL
spring.jpa.hibernate.ddl-auto: validate              # Don't modify schema
spring.flyway.locations: classpath:db/migration      # Migration scripts

org.quartz.scheduler.instanceId: AUTO                # Cluster instance ID
org.quartz.jobStore.isClustered: true                # Enable clustering
org.quartz.jobStore.clusterCheckinInterval: 10000    # Heartbeat interval
org.quartz.threadPool.threadCount: 10                # Job execution threads
```

---

## What's Implemented

### Phase 1: Quartz Clustering [COMPLETE]
- Multi-instance Quartz with PostgreSQL job store
- Cluster locking and failover
- Heartbeat-based node detection
- Verified exactly-once execution

### Phase 2: Domain Model & Persistence [COMPLETE]
- Clean domain entities (JobDefinition, JobExecutionLog)
- JPA repository implementations
- Flyway-managed database schema
- Reconciliation on startup

### Phase 3: GraphQL API [COMPLETE]
- Full job lifecycle via mutations (create, pause, resume, delete)
- Job queries and execution log retrieval
- Type-safe schema with scalars (JSON)
- Error handling and validation

### Phase 4: Infrastructure & Operations [COMPLETE]
- NGINX load balancer with dynamic upstream configuration
- Eureka service discovery for instance registration
- Eureka2NGINX reconciler for automatic load balancer updates
- Docker Compose orchestration with all services
- Postman collection for API testing
- Health checks and auto-recovery

### Phase 5: UI Dashboard (Future)
- Real-time job monitoring
- Visual job creation/editing forms
- Execution timeline
- Node status dashboard

---

## How It Works: End-to-End Flow

### Job Creation Flow

```
1. User sends GraphQL mutation: createJob(...)
   ↓
2. GraphQL controller validates input
   ↓
3. CreateJobService orchestrates:
   a. Create JobDefinition domain object
   b. Save to job_definition table
   c. Call QuartzSchedulingAdapter.schedule()
   ↓
4. QuartzSchedulingAdapter:
   a. Converts JobDefinition to Quartz Trigger
   b. Submits trigger to Quartz Scheduler
   ↓
5. Quartz (in cluster mode):
   a. Stores trigger in QRTZ_TRIGGERS
   b. Acquires cluster lock
   c. Propagates to all nodes
   ↓
6. Response returned to client with job ID
```

### Job Execution Flow

```
1. Quartz detects trigger fire time reached
   ↓
2. Acquires QRTZ_LOCKS for exactly-once guarantee
   ↓
3. Custom Job handler executes business logic
   ↓
4. ExecutionLogRepository logs result:
   - job_id, fire_time, status, error_message
   ↓
5. Other cluster nodes skip (no lock acquired)
   ↓
6. Result queryable via jobLogs(jobId) GraphQL query
```

### Reconciliation on Startup

```
1. DistributedSchedulerApplication starts
   ↓
2. Flyway applies pending migrations
   ↓
3. Quartz initializes with clustered job store
   ↓
4. ReconciliationService runs:
   a. Queries all ACTIVE jobs from database
   b. For each job, checks if Quartz trigger exists
   c. If missing, reschedules the trigger
   d. If orphaned trigger, removes it
   ↓
5. Cluster now has consistent state
   ↓
6. Application ready to process requests
```

---

## Testing

### Manual Testing with Postman

1. Open `postman/collections/New Collection.postman_collection.json`
2. Set environment variable: `baseURL=http://localhost:8081/scheduler-instance`
3. Run requests in sequence:
   - Create Job (creates a new job)
   - List Jobs (saves job IDs to environment)
   - Get Job By ID (retrieves specific job)
   - Pause Job (pauses execution)
   - Resume Job (resumes execution)
   - Run Job Now (triggers immediate execution)
   - Get Job Logs (views execution history)
   - Delete Job (removes job)

### Verifying Multi-Node Execution

1. Start multiple scheduler instances via Docker Compose
2. Create a job with frequent execution (e.g., `0/5 * * * * ?` - every 5 seconds)
3. Query execution logs: `SELECT * FROM job_execution_log ORDER BY fire_time DESC`
4. Verify only one instance appears per fire time (exactly-once guarantee)

---

## Observability & Debugging

### View Execution History

```sql
-- Latest 10 executions of a job
SELECT * FROM job_execution_log 
WHERE job_id = 'YOUR_JOB_ID' 
ORDER BY fire_time DESC 
LIMIT 10;

-- Failed executions
SELECT * FROM job_execution_log 
WHERE status = 'FAILED' 
ORDER BY fire_time DESC;

-- Job execution count by day
SELECT DATE(fire_time), COUNT(*) as executions 
FROM job_execution_log 
GROUP BY DATE(fire_time) 
ORDER BY DATE(fire_time) DESC;
```

### Check Quartz Cluster Status

```sql
-- Active cluster nodes
SELECT * FROM QRTZ_SCHEDULER_STATE;

-- Scheduled triggers
SELECT * FROM QRTZ_TRIGGERS;

-- Current locks
SELECT * FROM QRTZ_LOCKS;
```

### Application Logs

By default, logs are written to stdout. Key log messages:

```
INFO  Quartz Scheduler started
INFO  ReconciliationService: Reconciling active jobs
INFO  Job 'Daily Report' scheduled successfully
INFO  Job execution started: jobId=...
INFO  Job execution completed: status=SUCCESS, duration=2500ms
```

---

## Development Guide

### Adding a New Schedule Type

1. Add to `JobScheduleType` enum in domain model
2. Update GraphQL schema (`jobs.graphqls`)
3. Implement conversion in `QuartzSchedulingAdapter`
4. Add test cases

### Adding a New Mutation

1. Add to GraphQL schema (`jobs.graphqls`)
2. Create application service (e.g., `UpdateJobScheduleService`)
3. Implement GraphQL controller
4. Add integration tests

### Database Migrations

1. Create new file: `src/main/resources/db/migration/VN__description.sql`
2. Flyway auto-applies on next startup
3. Use standard DDL (CREATE, ALTER, etc.)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Spring Boot | 3.2.0+ |
| **Scheduler** | Quartz | 2.3.x |
| **Database** | PostgreSQL | 14+ |
| **Migrations** | Flyway | 10.x |
| **ORM** | JPA/Hibernate | 6.x |
| **API** | GraphQL (Spring GraphQL) | 1.x |
| **Build** | Maven | 3.8+ |
| **Java** | OpenJDK/Oracle | 17+ |

---

## Troubleshooting

### Job not executing

1. Check job status: `query { job(id: "...") { status } }`
2. Verify schedule: `SELECT * FROM QRTZ_TRIGGERS WHERE JOB_KEY = '...'`
3. Check for errors: `SELECT * FROM job_execution_log WHERE status = 'FAILED'`

### Duplicate executions on different nodes

- Ensure `org.quartz.jobStore.isClustered: true`
- Verify `QRTZ_LOCKS` table has entries
- Check cluster checkin interval: should be < job frequency

### No database connection

- Verify PostgreSQL is running: `psql -U scheduler -d scheduler`
- Check connection string in `application.yml`
- Ensure network connectivity to database host

### Migrations not applied

- Check `flyway_schema_history` table
- Ensure migration files are in `resources/db/migration/`
- Check file naming: `VN__description.sql`

---

## License

Internal project / Proprietary
