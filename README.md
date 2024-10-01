# Crypto Exchange App Backend

This is the backend API for the **Crypto Exchange App** that provides exchange rate data for **Bolivian Boliviano (BOB) to USDT**. The backend handles authentication, storing and updating exchange rates, and serves three APIs for currency rates, rate variance, and authorization. It is built with **Express.js**, **Node.js**, **MongoDB**, and **Mongoose**.

## Features

- **Exchange Rate Management**:
  - Store and update exchange rates for **BOB to USDT**.
  - Provides daily, weekly, and monthly exchange rate data.
  
- **APIs**:
  - **Currency Rate API**: Provides real-time currency exchange rates.
  - **Variance API**: Provides rate variance data (day, week, month).
  - **Auth API**: Handles user authentication with JWT tokens.

- **Authentication**:
  - Implements JWT-based authentication for admin login and rate updates.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose for data modeling
- **Security**: JSON Web Tokens (JWT) for authentication
- **Environment Management**: dotenv for environment variables
- **Cross-Origin**: CORS for handling cross-origin requests
- **HTTP Requests**: Axios for external API requests

## Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **MongoDB** (local database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/talha4real/crypto-exchange-backend.git
   cd crypto-exchange-backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file in the root directory and add the following variables:
   ```
   MONGO_URL="Add your Mongodb Url"
   PORT="add your port"
   USERNAME="add username"
   PASSWORD="add db password"
   JWT_SECRET="add jwt key"
   ```
4. Start the server:
   ```
   npm start
   ```

The server will be running on http://localhost:3000.

## Folder Structure
The project directory is structured as follows:
```
cryptoexchange-be/
controllers/
├── authController.js
├── currencyController.js
└── rateVarianceController.js
models/
├── currency.js
└── rate.js
routes/
├── authRoutes.js
├── currencyRoutes.js
└── rateVarianceRoutes.js
.env
.gitignore
package-lock.json
package.json
server.js
```
