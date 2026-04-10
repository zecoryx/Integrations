# Frontend Integrations Server

Node.js server for managing and unifying various frontend integrations, including payment gateways, database services, and external APIs. This server provides a clean, abstract layer to handle interactions with third-party systems seamlessly.

## Core Features

- **Payment Integrations**: Pre-configured PayPal and other gateway support.
- **Database Architecture**: Prisma ORM with MongoDB backing.
- **Secure Handling**: Enhanced body parsing, secure hashing, and payload validation.
- **Utility Tools**: File processing (PDF, Excel, images) and date management (Luxon).

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma + MongoDB
- **Key Libraries**: Axios, Firebase, ReCaptcha V3, class-validator.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory based on the specific required keys for your integrations.

3. Start the development server:
   ```bash
   npm start
   ```

## Build for Production

Compile the TypeScript files by running:

```bash
npm run build
```

## Structure

- `/server`: Main application bootstrap and API routes.
- `/core`: Essential business logic and core types.
- `/data`: Database configurations and models.
- `/integrations`: Third-party integration logic (PayPal, Firebase, etc.).
- `/utilities` & `/utils`: Reusable helper functions and libraries.

## License

ISC