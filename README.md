# Distributed Scheduler

## Overview

Modern distributed systems need **a reliable scheduler** that can:

* Run tasks **across multiple instances**
* Guarantee **only one node executes a job at a time**
* Persist job state to a database
* Allow **dynamic job creation**, updates, pausing, resuming, deletion
* Provide **execution logs**, job metadata, cluster-safe triggers, and reconciliation

This project implements a **Distributed, Multi-Node, Database-Backed Scheduler** using:

* **Spring Boot 3**
* **Quartz Scheduler (cluster mode)**
* **PostgreSQL**
* **Clean Architecture (Hexagonal)**
* **Flyway Migrations**
* **Domain-Driven Design entities & ports**

The goal:
> Provide an **extensible, scalable, safe, cloud-ready scheduling system**.

---

# Problem Statement

Typical in-memory schedulers (like Spring’s `@Scheduled`) fail in distributed environments:

* They run **on every node**, causing duplicates
* They have **no persisted job state**
* They cannot **dynamically add/remove** jobs
* They offer no **execution history**
* Failures can cause **lost jobs** or **stuck triggers**
* No **consensus or cluster heartbeats**

We need a solution that ensures:

### ✔ Exactly-once job execution across multiple instances

### ✔ Resiliency through DB-backed Quartz job store

### ✔ Job definition persistence & versioning

### ✔ Execution logs and observability

### ✔ API-driven job management

### ✔ Reconciliation after restarts

---

#  **Why Not @Scheduled? (Problem Statement)**

Typical Spring in-memory schedulers:

❌ Run on *every* node
❌ No persistence (lost jobs on restart)
❌ Cannot dynamically create/update/remove jobs
❌ No execution logs
❌ Fail in distributed systems (double-execution, race conditions)

**Goal:**

### ✔ Ensure exactly-once job execution across a cluster

### ✔ Persist job metadata + execution logs

### ✔ Provide API-driven dynamic job scheduling

### ✔ Recover safely after crashes (reconciliation)

### ✔ Stay cloud-friendly, horizontally scalable

---

---

# Architecture Overview

```
                      +------------------------+
                      |   GraphQL API Layer    |
                      +-----------+------------+
                                  |
                                  v
               +---------------------------------------+
               |     Application Services (Use Cases)   |
               +--------------------+-------------------+
                                   |
      +----------------------------+-----------------------------+
      |                                                          |
      v                                                          v
+------------------------+                       +-----------------------------+
| JobDefinitionRepoPort  |     Domain Ports      |   JobSchedulerPort          |
+------------------------+                       +-----------------------------+
      |                                                          |
      v                                                          v
+------------------------------+             +--------------------------------+
| PostgreSQL (job metadata)    |             | Quartz Scheduler (clustered)   |
+------------------------------+             +--------------------------------+
```

# 📦 **Implementation Phases**

The project follows a structured 4-phase roadmap.

---

# **Phase 1 — Quartz Clustering (✓ Completed)**

**Objective:** Multi-instance Quartz running as ONE logical scheduler.

Completed:

✔ Quartz configured with PostgreSQL (`JobStoreTX`)
✔ Full Flyway-managed Quartz schema
✔ Clustering enabled (`isClustered = true`)
✔ Heartbeats & failover handling
✔ Multi-instance test: **Only one node executes each job**
✔ Verified DB-based locking & election

---

# **Phase 2 — Domain Model & Persistence Layer (✓ Completed)**

### ✔ Database

Tables created via Flyway:

* `job_definition`
* `job_execution_log`

### ✔ Domain

* DDD JobDefinition model
* ExecutionLog model
* Schedule types (CRON, FIXED_RATE, FIXED_DELAY)
* Status lifecycle (ACTIVE, PAUSED, DELETED)

### ✔ Persistence Layer

* JPA entities
* Repository adapters implementing domain ports

### ✔ Quartz Scheduling Integration

* QuartzSchedulingAdapter bridging domain → Quartz
* Supports all schedule types
* Execution logged each time a job fires

### ✔ Reconciliation (Startup Repair)

On startup, Quartz:

* Retrieves persisted ACTIVE jobs
* Rebuilds triggers
* Re-schedules missing jobs
* Prevents duplicate scheduling

### ✔ End-to-End Complete

* Job created → persisted → scheduled → executed → logged
* Multi-node cluster test validated

---

# **Phase 3 — API Layer (GraphQL) (✓ Completed)**

We now expose full job lifecycle management via GraphQL.

### Supported Mutations

✔ `createJob`
✔ `pauseJob`
✔ `resumeJob`
✔ `deleteJob`
✔ `runJobNow`

### Supported Queries

✔ `jobs`
✔ `job(id)`
✔ `jobLogs(jobId)`

### Input Types

* Flat fields (no nested trigger object)
* Supports cron or interval-based scheduling
* JSON payload via `graphql-java-extended-scalars`

---

# **Phase 4 — Dashboard UI (Future)**

Planned features:

* Job list with status, schedule, next fire time
* Execution logs viewer
* Node status monitor
* Job creation/update forms
* Run-now, pause/resume, delete controls

Likely built in React or Vaadin.

---

# ✔ **What Has Been Delivered**

### Foundation

* Spring Boot 3
* Hexagonal architecture
* PostgreSQL + Hikari
* Flyway migrations

### Scheduler Engine

* Quartz in cluster mode
* Verified distributed locking
* Trigger persistence
* Misfire handling

### Domain & Persistence

* Clean domain model
* Entities + repositories
* Versioning ready
* JSON payload support

### Application Services

* Create / Pause / Resume / Delete / RunNow
* Full orchestration between DB + Quartz
* Execution logging

### GraphQL API

* Complete GraphQL schema
* Scalars (JSON)
* DTOs + Controllers
* Typed responses
* Error handling

### Reconciliation

* Ensures scheduler recovers on restart
* Matches DB state with Quartz state
* Prevents orphan triggers

### Cluster Testing

* Multiple JVMs running simultaneously
* Verified exactly-once execution

---

# 🚀 **Next Steps**

### 1. REST API (optional)

* Mirror GraphQL endpoints for REST consumers

### 2. Updating & Versioning Jobs

* Schedule update
* Version increment
* Soft delete lifecycle

### 3. Stronger Reconciliation Logic

* Delete orphaned triggers
* Rebuild missing definitions

### 4. Observability Enhancements

* Structured logging (jobId, duration, node)
* Next fire time in responses
* Node metrics

### 5. UI Dashboard (Phase 4)

* Real-time job status
* Logs streaming
* Node list
* Trigger previews

### **Validation**

* Cron validation
* Interval validation
* Payload schema validation

---

## **Phase 4 — UI Dashboard (Future)**

A lightweight dashboard allowing users to:

* Create jobs
* See schedules & states
* View execution logs
* Pause/resume/delete jobs
* Trigger run-now
* Monitor cluster nodes

---

# ✔ What We Have Completed So Far

### Foundation

* Spring Boot project setup
* PostgreSQL + Hikari + JPA
* Flyway migration system

### Quartz Cluster Engine

* Complete Quartz schema in DB
* Clustering enabled
* Verified locking & leadership

### Domain Layer

* JobDefinition and JobExecutionLog models
* JPA entities
* Repository adapter
* Service layer abstractions

### Scheduling Layer

* QuartzSchedulingAdapter
* Unified handling of:

    * CRON
    * FIXED_RATE
    * FIXED_DELAY

### Reconciliation

* Ensures scheduler recovers after restart
* Fixed double scheduling bug

### End-to-End Workflow

* Job created → persisted → scheduled → executed → logged
* Multiple-node execution verified

---

# What’s Next?

Here are the next concrete deliverables:

## **1. Full REST API (Phase 3)**

* DTOs
* Controllers
* Global error handling
* Cron validation service

## **2. Job Lifecycle Management**

* Update schedule
* Soft delete / status handling
* Version increment logic

## **3. Improved Reconciliation**

* Compare DB vs Quartz
* Delete orphaned triggers
* Rebuild missing jobs

## **4. Observability Improvements**

* Log structured metadata
* Add execution duration
* Add next-fire-time to responses

## **5. UI Dashboard (Phase 4)**

Built with either React or Vaadin.

---

# How to Run Locally

### Start PostgreSQL with Quartz schema

Apply Flyway migrations automatically (happens on startup).

### Build

```
mvn clean package
```

### Run

```
java -jar target/distributed-scheduler-1.0-SNAPSHOT.jar
```

### Verify job execution

Check logs:

```
SELECT * FROM job_execution_log ORDER BY fire_time DESC;
```

### Test via GraphQL

Open:

```
http://localhost:8080/graphql
```

Example mutation:

```graphql
mutation {
  createJob(input: {
    name: "Test Job"
    scheduleType: "CRON"
    cronExpression: "0/10 * * * * ?"
    payload: { "type": "demo" }
  }) {
    id
    name
    status
  }
}
```

# License

Internal project / proprietary.
