# 🚨 IMAS — Incident Management & Alerting System

**IMAS** is a scalable and modular backend system for managing incidents, SLAs, escalations, and real-time notifications in a production environment. Built with **Node.js**, **Express**, **MongoDB**, **Redis**, and **BullMQ**, it supports role-based access, reporting, and auditing for operational transparency.

---
## 🌐 Live Demo

**🚀 Deployed on Render**  
🔗 [https://imas.onrender.com](https://imas.onrender.com)

You can test all public and protected endpoints using tools like **Postman** or **curl**.

---
## 🔧 Features

* ✅ **Authentication & RBAC**: JWT-based login with admin, engineer, and user roles.
* 🛠️ **Incident Management**: CRUD operations for incident lifecycle management.
* ⏱️ **SLA Tracking**: Auto-assignment of SLA hours based on priority, with real-time SLA breach detection.
* 🚨 **Escalation Flow**: Manual and automatic escalation management.
* 🔔 **Asynchronous Notifications**: Notification queuing using Redis + BullMQ workers.
* 📝 **Audit Logging**: Logs all key actions like SLA assignments and escalations.
* 📄 **Report Generation**: Export incidents as CSV or PDF.
* 📊 **ElasticSearch Integration** (stubbed): For future log/incident indexing & search.

---

## 📁 Project Structure

```
IMAS/
├── Authentication/
│   └── routes/authRoutes.js
├── Incident/
│   ├── models/Incident.js
│   └── routes/incidentRoutes.js
├── SLA/
│   └── routes/slaRoutes.js
├── Escalation/
│   └── routes/escalation.js
├── Notifications/
│   ├── model/Notification.js
│   ├── notificationQueue.js
│   ├── notificationWorker.js
│   └── routes/notificationRoutes.js
├── Reports/
│   └── routes/reportRoutes.js
├── AuditLogs/
│   ├── model/AuditLog.js
│   ├── logger/auditLogger.js
│   └── routes/auditRoutes.js
├── db.js
├── jwt.js
├── rbac.js
├── server.js
└── .env
```

---

## ⚙️ Tech Stack

| Layer            | Tech                         |
| ---------------- | ---------------------------- |
| Server Framework | Express.js                   |
| Database         | MongoDB + Mongoose           |
| Auth             | JWT                          |
| Queue System     | BullMQ + Redis               |
| Reporting        | json2csv, pdfkit             |
| Notifications    | Mongo-backed Notification DB |
| Logging          | AuditLog collection          |
| Search           | Elasticsearch (planned)      |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/imas.git
cd imas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on the following template:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URL=mongodb://localhost:27017/imas_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ELASTIC_NODE=http://localhost:9200
```

### 4. Start Redis Server (if not already running)

```bash
# MacOS / Linux
redis-server

# Windows (via Redis Desktop or Docker)
```

### 5. Start the Server

```bash
node server.js
```

Worker will auto-start via:

```js
require('./Notifications/notificationWorker');
```

---

## 🛡️ Authentication & RBAC

### Roles Supported:

* `admin`
* `engineer`
* `user`

Use `/auth/login` to receive JWT token. Pass it as:

```
Authorization: Bearer <token>
```

---

## 📬 Endpoints Overview
**🚀 Deployed on Render:**  
🔗 [https://imas.onrender.com](https://imas.onrender.com)

### 🔐 Auth


| Method | Endpoint       | Role   |
| ------ | -------------- | ------ |
| POST   | /auth/register | public |
| POST   | /auth/login    | public |

### ⚙️ Incidents

| Method | Endpoint        | Role                  |
| ------ | --------------- | --------------------- |
| GET    | /incidents      | admin, engineer       |
| POST   | /incidents      | admin, engineer, user |
| PUT    | /incidents/\:id | admin, engineer       |
| DELETE | /incidents/\:id | admin                 |

### 📏 SLA

| Method | Endpoint        | Role            |
| ------ | --------------- | --------------- |
| POST   | /sla/assign-sla | admin           |
| GET    | /sla/violations | admin, engineer |

### 🚨 Escalation

| Method | Endpoint                | Role            |
| ------ | ----------------------- | --------------- |
| GET    | /api/escalations        | admin, engineer |
| POST   | /api/escalations/manual | admin           |

### 🔔 Notifications

| Method | Endpoint                 | Role          |
| ------ | ------------------------ | ------------- |
| GET    | /notifications           | Authenticated |
| PATCH  | /notifications/\:id/read | Authenticated |

### 📄 Reports

| Method | Endpoint           | Role            |
| ------ | ------------------ | --------------- |
| GET    | /reports/incidents | admin, engineer |

Query Params:

* `format=csv` or `format=pdf`
* Optional: `status`, `priority`, `startDate`, `endDate`

### 🕵️ Audit Logs

| Method | Endpoint | Role            |
| ------ | -------- | --------------- |
| GET    | /audit   | admin, engineer |

---

## 📤 Notifications Flow

1. Worker starts with `notificationWorker.js`
2. `addNotificationJob()` queues a job to Redis.
3. Worker listens for jobs and stores notification in MongoDB.
4. Client can fetch and mark notifications via `/notifications`.

---

## 📝 Logging & Auditing

Every SLA assignment, breach, or escalation is logged via:

```js
await logAudit({
  action: 'SLA_BREACH',
  actor: req.user.id,
  target: incident._id,
  description: `SLA violated for "${incident.title}"`
});
```

Logs are stored in `AuditLog` collection.

---
## 🧠 Future Enhancements

* [ ] Full-text search via Elasticsearch
* [ ] Real-time notification delivery (WebSockets or SSE)
* [ ] Email/SMS integrations for SLA breaches
* [ ] Role-based UI with dashboards
* [ ] Incident severity trends and analytics

---

## 👨‍💼 Maintained By

**Sagar Jha** — [LinkedIn](https://www.linkedin.com/in/sagar0333/) | [GitHub]([https://github.com](https://github.com/Saagarjha1/profile/tree/main))

> Contributions welcome. Fork it. Star it. Improve it!

---
