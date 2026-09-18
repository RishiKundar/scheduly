# 🚀 Scheduly: Distributed Job Scheduler

![Java](https://img.shields.io/badge/Java-21-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Streaming-black?logo=apachekafka)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)

**Scheduly** is an enterprise-grade, highly resilient distributed job scheduling engine. Built to handle massive scale, it guarantees at-least-once delivery of HTTP webhooks and prevents duplicate executions across multiple worker nodes.

---

## ✨ System Architecture & Key Features

This project was built to solve the complex challenges of distributed systems, utilizing advanced backend patterns:

* 📥 **The Transactional Outbox Pattern:** Solves the dual-write problem. Jobs are saved to PostgreSQL alongside an `OutboxEvent` in a single ACID transaction, ensuring no data is ever lost before reaching Kafka.
* 🔒 **Atomic Database Leasing:** Worker nodes utilize pessimistic locking (`FOR UPDATE SKIP LOCKED`) to acquire atomic 30-second leases on jobs, guaranteeing that no two workers ever execute the same job concurrently.
* ♻️ **Resiliency & Auto-Recovery:** Built-in exponential backoff for failed HTTP webhooks. A dedicated recovery loop reclaims "orphaned" jobs if a worker node crashes mid-execution.
* 🔐 **Bank-Grade Security:** Supports Multi-Tenant JWT authentication. Sensitive API keys and headers are encrypted at rest in the database using **AES-GCM encryption**.
* 🎨 **Modern Frontend:** A beautiful, responsive React dashboard built with Tailwind CSS v4, featuring interactive canvas animations and real-time execution tracking.

## 🛠️ Tech Stack

**Backend (The Engine):**
* Java 21 & Spring Boot
* Apache Kafka & Zookeeper (Event Streaming)
* PostgreSQL (Neon DB) & Spring Data JPA
* Flyway (Database Migrations)
* Spring Security & JWT

**Frontend (The Dashboard):**
* React (Vite)
* Tailwind CSS v4
* Axios

**Infrastructure:**
* Docker & Docker Compose

---

## 🚀 Getting Started

You can spin up the entire distributed system (Spring Boot, Kafka, and Zookeeper) locally using Docker.

### 1. Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* Node.js (for the frontend).

### 2. Environment Variables
Create a `.env` file in the root directory and add your secrets (never commit this file):
```env
DB_URL=jdbc:postgresql://your-database-url
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
ENCRYPTION_KEY=YourSuperSecretAesKey123
JWT_SECRET=YourSuperSecretJwtKey123
```

### 3. Start the Backend Cluster
Open your terminal in the root directory and run:
```bash
docker-compose up -d --build
```
This will start Zookeeper, Kafka, and the Spring Boot Scheduling Engine on `http://localhost:8082`.

*(Optional: To test distributed locking, scale the workers! `docker-compose up -d --scale scheduling-service=3`)*

### 4. Start the Frontend
Open a new terminal in the `/frontend` folder:
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the animated landing page and log in!

---

## 🧠 What I Learned
Building this project was a deep dive into distributed systems engineering. I learned how to architect systems that can survive network failures, worker crashes, and database bottlenecks without ever dropping a scheduled job. 

## 🤝 Contributing
Feel free to open issues or submit pull requests for new features (like Job Chaining, Redis Rate Limiting, or Prometheus monitoring)!

---
*Designed & Engineered by Rishi.*