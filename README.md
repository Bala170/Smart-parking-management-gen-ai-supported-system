# Parkwise — Smart Parking for Public Places

[![Project Status](https://img.shields.io/badge/Status-Complete%20Frontend%20Prototype-success.svg)](https://github.com)
[![Framework](https://img.shields.io/badge/Stack-React%2019%20%2B%20Vite%206%20%2B%20Tailwind%20CSS-blue.svg)](https://vite.dev)
[![Architecture](https://img.shields.io/badge/Architecture-FastAPI--Ready%20Service%20Layer-navy.svg)](https://fastapi.tiangolo.com)

A final-year project prototype for finding and managing parking at busy public destinations, including bus terminals, railway stations, markets, parks, hospitals, and event venues. It includes destination search, illustrative availability, session tracking, digital credentials, payments, and operator monitoring.

---

## 🏛️ Project Overview & Purpose

Busy public destinations create congestion as drivers search for parking, especially around transit hubs and crowded districts. This prototype brings destination discovery and parking operations into one interface. 

This framework implements:
1. **Public Destination Finder**: Search and filter illustrative parking availability across transit hubs, markets, parks, hospitals, and event venues.
2. **RFID-Based Vehicle Identification**: Automatic ultrasonic loop and UHF RFID transponder scanning at entrance barriers.
3. **Digital Parking Sessions**: Cryptographic dynamic QR tokens tied to database sessions with live spatial tracking.
4. **Secure Lost-Token Recovery**: Multi-Factor Authentication (MFA OTP) identity challenge workflow issuing temporary recovery passes without human operator bottlenecks.
5. **Time-Bound Delegated Vehicle Retrieval**: Owner-authorized temporary proxy pickup credentials with single-use QR/OTP codes and configurable validity windows.
6. **Decoupled GenAI Conversational Layer**: Natural-language interaction assistant that advises users on slot locations, fee tariffs, and retrieval without holding direct authority over barrier actuation.

Availability, drive times, and tariffs shown on destination cards are illustrative project data; they are not connected to live municipal sensors or a booking service.

The project also includes a camera-ready monitoring slice. It supports persisted camera and zone configuration, demo detection events, slot freshness tracking, REST monitoring endpoints, and an operator WebSocket feed. The demo mode is deterministic and does not require physical cameras.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v24+`
- npm `v9+` or `v11+`

### Installation & Launch
```bash
# 1. Navigate to the project root
cd "c:\Users\svbal\OneDrive\Desktop\final yr"

# 2. Install dependencies (already installed)
npm install

# 3. Start the Vite local development server
npm run dev
```

Visit the application at: **`http://localhost:3000`**

Use one browser origin consistently during the demo: `localhost:3000` and
`127.0.0.1:3000` keep separate browser storage. If the admin console shows
403 after switching hosts, open the same origin used for the app and click
**Elevate to Admin Role** once; the button now switches the demo role and
redirects directly to the admin dashboard.

### Backend and monitoring mode

```powershell
# In a second terminal
cd "c:\Users\svbal\OneDrive\Desktop\final yr\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Set `VITE_API_BASE_URL=http://localhost:8000/api` when running the frontend against FastAPI. Without that variable, the existing mock mode remains available.

Monitoring endpoints are available under `/api/monitoring`:

- `GET /summary`, `GET /cameras`, `GET /zones`, and `GET /detections`
- `POST /demo/ingest` with a camera ID and occupied slot codes
- `WS /ws` for a five-second monitoring summary stream

For the first demo, create an admin user, configure one camera and zone, then post a payload such as:

```json
{
  "camera_id": 1,
  "occupied_slot_codes": ["A01", "A12"],
  "vehicle_plates": {"A12": "TN-09-BK-4821"}
}
```

The admin console's **Live Monitoring** page also includes a **Run demo frame** action. A slot is treated as stale after 90 seconds without a fresh camera or sensor update; stale slots must be treated as unknown rather than available.

---

## 🗺️ Role-Based Application Architecture

The system features two experiences accessible via the top-bar role toggle:

### A. Vehicle Owner Portal (`/user/*`)
- **Find Parking (`/user/dashboard`)**: Search and filter illustrative availability across public destination types, alongside active session details and live bay occupancy.
- **Active Parking (`/user/parking`)**: Detailed bay telemetry, sensor status, and spatial grid across Zones A, B, and C.
- **Digital Parking Token (`/user/token`)**: Dynamic QR credential, token specifications, validity countdown, and print/download pass options.
- **Lost Token Recovery (`/user/recovery`)**: 4-Step interactive recovery wizard:
  1. *Identify Session* (Plate `TN-09-BK-4821` & Mobile)
  2. *MFA OTP Challenge* (Demo OTP: `482915` or `123456`)
  3. *Vehicle & Session Verification*
  4. *Emergency Recovery Credential Generation with Countdown*
- **Delegated Retrieval (`/user/delegation`)**: Issue time-bound proxy credentials to friends/family with OTP challenge, validity timer, and instant revocation capability.
- **My Vehicles (`/user/vehicles`)**: Register and manage vehicles, license plates, and assigned RFID transponders.
- **Payments (`/user/payments`)**: Clear parking dues via UPI QR, RuPay Card, or digital wallet with instant invoices.
- **Parking History (`/user/history`)**: Audit table with search, status filters, retrieval method tracking (RFID, Digital Token, Lost Token Recovery, Delegated Retrieval), and CSV export.
- **Notifications (`/user/notifications`)**: Live telemetry alerts, fee updates, and gate activity.
- **Profile & RFID (`/user/profile`)**: Driver profile and registered vehicle tags.

### B. Admin & Parking Operator Console (`/admin/*`)
- **Overview (`/admin/dashboard`)**: 8 KPI cards, Hourly Occupancy Line Chart, Retrieval Methods Pie Chart, and Weekly Revenue Bar Chart.
- **Parking Slots (`/admin/parking-slots`)**: Visual spatial layout of all 36 bays (Zones A, B, C) with status legend (Available, Occupied, Reserved, Maintenance) and manual override modal.
- **Active Sessions (`/admin/sessions`)**: Ingress sessions table with RFID tag monitoring and manual barrier actuation triggers.
- **Gate Clearance Console (`/admin/retrievals`)**: Monitor and approve Gate 2 barrier actuation across all retrieval mechanisms.
- **Delegations Governance (`/admin/delegations`)**: Active, completed, and revoked proxy authorizations with emergency admin revocation.
- **Vehicle Registry (`/admin/vehicles`)**: Master list of all registered RFID tags and vehicles.
- **Cardholders (`/admin/users`)**: Registered driver profiles.
- **Tariffs & Revenue (`/admin/payments`)**: Hourly tariff plans and settled transaction ledger.
- **Security Audit Logs (`/admin/audit-logs`)**: Tamper-evident audit trail with IP address, gate node, and action codes.
- **Threat Monitoring (`/admin/security`)**: Security dashboard tracking failed auth, invalid OTPs, expired QRs, and gate barrier security policies.

---

## 🤖 GenAI Conversational Layer Architecture

A persistent floating button opens the **GenAI Parking Assistant**.

### Architectural Decoupling Rule
> **Crucial Academic & Security Distinction**: The GenAI assistant is strictly an **interaction and intent-parsing layer**. It **NEVER** holds authority to release the physical barrier or modify security state directly.

Execution Pipeline displayed in the assistant UI:
$$\text{User Query} \xrightarrow{} \text{GenAI Intent Parser} \xrightarrow{} \text{FastAPI Backend Engine} \xrightarrow{} \text{Multi-Factor Challenge} \xrightarrow{} \text{Barrier Actuation}$$

Example supported queries:
- *"Where is my bike parked?"* → Resolves spatial slot telemetry (Bay A-12).
- *"How much is my current parking fee?"* → Queries tariff matrix and duration (₹40.00).
- *"I lost my parking token."* → Directs to MFA verification workflow with session card.
- *"I want my friend to collect my bike."* → Launches time-bound proxy delegation flow.
- *"Show my parking history."* → Provides session ledger summary.

---

## 🔌 Future FastAPI Backend Integration

All mock services in `src/services/` are structured to map directly to FastAPI endpoints:

| Frontend Service Call | Future FastAPI Route | Description |
| :--- | :--- | :--- |
| `parkingService.getParkingStatus()` | `GET /api/parking/status` | Capacity & occupancy stats |
| `parkingService.getActiveSession()` | `GET /api/parking/session` | Active user parking session |
| `parkingService.getParkingSlots()` | `GET /api/parking/slots` | Spatial bay sensor data |
| `tokenService.getDigitalToken()` | `GET /api/token/session/{id}` | Dynamic QR credential |
| `recoveryService.identifySession()` | `POST /api/recovery/identify` | Step 1 session lookup |
| `recoveryService.verifyOtp()` | `POST /api/recovery/verify-otp` | Step 2 MFA challenge |
| `recoveryService.generateRecoveryCredential()` | `POST /api/recovery/generate` | Step 4 credential creation |
| `delegationService.createDelegation()` | `POST /api/delegation/create` | Issue time-bound delegation |
| `delegationService.revokeDelegation()` | `POST /api/delegation/revoke` | Revoke proxy access |
| `paymentService.processPayment()` | `POST /api/payment/create` | Tariff settlement |
| `adminService.getAuditLogs()` | `GET /api/admin/audit-logs` | Tamper-evident audit ledger |
| `adminService.updateRetrievalStatus()` | `POST /api/admin/retrievals/actuate` | Gate barrier signal |
| `aiService.processQuery()` | `POST /api/ai/query` | LLM intent routing |

---

## 🎨 Design System Specifications
- **Color Palette**: Navy Primary (`#0f172a`), Deep Accent (`#1e3a8a`, `#2563eb`), Slate Neutral Background (`#f8fafc`), Clean Card Background (`#ffffff`), Emerald Success (`#10b981`), Amber Warning (`#d97706`), Red Alert (`#dc2626`).
- **Typography**: Inter (Google Fonts) with JetBrains Mono for cryptographic hashes, plates, and timestamps.
- **Presentation-Ready**: Crisp IEEE project presentation aesthetics, screenshot-friendly data tables, and print-ready digital passes.
