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

# Architecture Overview

```
            +----------------------------+
            |     REST API (Future)      |
            +----------------------------+
                        |
                        v
        +-------------------------------------+
        |   Application Services (Use Cases)  |
        +-------------------------------------+
                        |
                        v
        +-------------------+   +-------------------+
        | JobDefinitionRepo |   |  JobSchedulerPort |
        +-------------------+   +-------------------+
                 |                     |
                 v                     v
+------------------------------+    +------------------------------+
|  PostgreSQL (job metadata)   |    | Quartz (clustered scheduler) |
+------------------------------+    +------------------------------+
```

---

# Implementation Phases

This project is being built in **4 major phases**.

## **Phase 1 — Quartz Clustering (Completed ✓)**

Goal: Ensure **multiple instances behave as one scheduler**.

Accomplished:

* PostgreSQL Quartz schema applied via **Flyway**
* Quartz configured with:

    * `JobStoreTX`
    * `isClustered=true`
    * heartbeat / misfire settings
* Multiple instances tested (1 → many)
* Cluster test job verified **only one node executes**

---

## **Phase 2 — Domain Model + Job Persistence (In Progress ✓)**

### Completed:

✔ Created `job_definition` & `job_execution_log` tables
✔ Implemented domain models
✔ Implemented JPA entities + repositories
✔ Added `JobSchedulingService` orchestrating:

* persist job
* schedule job
  ✔ Added execution logging inside `QuartzJobExecutor`
  ✔ Added CommandLineRunner to test creation
  ✔ Reconciliation mechanism added (and debugged)
  ✔ Multi-instance job creation and execution verified end-to-end

### Current State:

The system now supports:

* Creating new jobs
* Persisting them in DB
* Scheduling them in Quartz
* Running them cluster-safely
* Logging executions to DB

---

## **Phase 3 — API Layer (Coming Next)**

We will build REST endpoints:

### **Job Management APIs**

* `POST /jobs` — create job
* `PUT /jobs/{id}` — update job
* `DELETE /jobs/{id}` — delete job
* `POST /jobs/{id}/pause`
* `POST /jobs/{id}/resume`
* `POST /jobs/{id}/run-now`

### **Query APIs**

* `GET /jobs`
* `GET /jobs/{id}`
* `GET /jobs/{id}/logs`

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

---

# License

Internal project / proprietary.
