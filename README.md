# 🌬️ WindSpec

> A full-stack wind turbine monitoring and control application for analyzing the wind spectrum.

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=flat&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat&logo=redis&logoColor=white)
![Live](https://img.shields.io/badge/Live-fly.io-blueviolet?style=flat)

---

## 📖 Overview

WindSpec is a classical 3-tier solution with repositories, services, and a REST API connected to a React frontend. The system subscribes to an **MQTT broker** to receive real-time data from wind turbines and persists it to the database as needed. The dashboard shows a live overview of the farm with the ID GSVB2.


**Key characteristics:**
- 🏗️ Clear layer division (Repository → Service → API → Frontend)
- 📦 Fully containerized with Docker
- ⚡ Redis caching for performance
- 🔄 Automated tests and CI/CD — deploys on merge to `main`
- 📡 MQTT integration for live turbine telemetry
- 📈 Scalable architecture

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose

### Run Locally

Clone the repository and run the following command from the root directory:

```bash
docker-compose up --build
```

The API and frontend will be available at your configured ports once the containers are up.

### 🌐 Live Demo

The application is deployed and accessible at:
**[https://client-bold-dew-702.fly.dev](https://client-bold-dew-702.fly.dev)**

> Hosted on [fly.io](https://fly.io) · Database on [neon.tech](https://neon.tech)

---

## 🖥️ Usage

Once the application is running, log in with a valid user account. You can create one via Swagger or use the predefined credentials:

| Field    | Value      |
|----------|------------|
| Username | `Arne1312` |
| Password | `test`     |

After logging in, you will have access to a **dashboard showing 4 wind turbines**. Click on a turbine name in the graphs to interact with it and adjust its settings.

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | React + TypeScript      |
| Backend     | .NET (C#)               |
| Database    | PostgreSQL (neon.tech)  |
| Cache       | Redis                   |
| Messaging   | MQTT                    |
| Deployment  | Docker, fly.io          |

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GreenzQe">
        <img src="https://github.com/GreenzQe.png" width="80px" alt="GreenzQe"/><br />
        <sub><b>GreenzQe</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/benj4515">
        <img src="https://github.com/benj4515.png" width="80px" alt="benj4515"/><br />
        <sub><b>benj4515</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MathiasFIv">
        <img src="https://github.com/MathiasFIv.png" width="80px" alt="MathiasFIv"/><br />
        <sub><b>MathiasFIv</b></sub>
      </a>
    </td>
  </tr>
</table>

