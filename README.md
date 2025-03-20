# RoleMap

RoleMap is a application management system designed to modernise and simplify the job searching process. This is an all-in-one platform that combines intelligent tracking, document management and automation tools that help job seekers maintain an organised and effective job search campaign.

![Image of Dashboard Page](assets/DashBoard.png)
![Image of Tracker Page](assets/Tracker.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Docker Setup](#-docker-setup)
- [Tech Stack](#️-tech-stack)

## 🚀 Getting Started

Prerequisites
Before you begin, ensure you have the following installed:

[![npm version](https://img.shields.io/badge/npm-v8.0.0-blue?style=flat-square&logo=npm)](https://www.npmjs.com/)
[![Node.js Version](https://img.shields.io/badge/node-v16.0.0-green?style=flat-square&logo=node.js)](https://nodejs.org/)

## Installation

1. Clone the repo:

```bash
  git clone git@github.com:ramkaucha/RoleMap.git
  cd RoleMap
```

2. Install dependences:

Backend services:

```bash
cd backend/
pip install -r requirements.txt
```

```bash
cd frontend/
npm install
```

## Usage

To run the project, use the following command:

```bash
cd backend/
python -m app.main

cd frontend/
npm run dev
```

## 🐳 Docker Setup

RoleMap can be run using Docker for a consistent development environment.

### Prerequisites

- Docker and Docker Compose

### Running with Docker

First initializing:

```bash
./
docker-compose up --build
```

Starting the containers again:

```bash
docker-compose up
```

Stop the containers:

```bash
docker-compose down
```

## 🛠️ Tech Stack

[![Next.ts](https://img.shields.io/badge/Next.ts-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge)](https://ui.shadcn.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![TanStack Table](https://img.shields.io/badge/TanStack_Table-FF4154?style=for-the-badge&logo=reacttable&logoColor=white)](https://tanstack.com/table/latest)
[![framer-motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![OAuth 2.0](https://img.shields.io/badge/OAuth_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://oauth.net/2/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
