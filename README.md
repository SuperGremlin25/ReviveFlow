# ReviveFlow

# Home Stager Billing & Time Tracking MVP

ReviveFlow is a simple, Dockerized web application for solo home stagers to manage clients, jobs, expenses, and generate invoices. Built with React, FastAPI, and PostgreSQL.

---

## Features

- Add/manage clients
- Add/manage jobs (with client assignment)
- Track expenses per job
- View job summaries and download invoices as PDF
- All data managed via a clean dashboard

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, @tanstack/react-query v5
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Containerization: Docker Compose

## Quick Start

1. Clone the repo:

 
    ```bash
    git clone https://github.com/SuperGremlin25/ReviveFlow.git
    cd ReviveFlow
    ```

2. Set up environment:
    - Copy `.env.example` to `.env` and adjust if needed.

3. Run with Docker Compose:


    ```bash
    docker-compose up --build
    ```

4. Access the app:
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API/docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Seeding Demo Data

- Use the provided Python script or API endpoints to add clients, jobs, and expenses for demo/testing.

## License

MIT
