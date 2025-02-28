# README for Payex API Server

## Overview
This is a simple invoice management system built using Node.js. It allows users to manage invoices and receipts, with functionalities for creating, retrieving, and storing invoices. The system uses a file-based storage mechanism (JSON) for simplicity, but there are ongoing plans to implement Celestia network integration for decentralized storage of invoices in the future.

## Features
- **Create Invoices**: You can create new invoices and store them.
- **Get Invoices**: Retrieve invoices by their ID, recipient ("to"), or requester.
- **Create Receipts**: Create receipts that mark invoices as paid.
- **User Authentication**: Register a user using their wallet address, generating a random alias for the user.
- **User Data**: Fetch the list of users who have interacted with the system.

## Technologies Used
- **Node.js**: Server-side runtime for handling HTTP requests and responses.
- **HTTP module**: Native Node.js module for creating an HTTP server.
- **fs (File System)**: Used for reading and writing JSON data from/to local files.
- **url**: Used for parsing request URLs and handling query parameters.
- **cookie**: Utilized for handling cookies in authentication.

## File Structure
- **data.json**: Stores invoices and receipts data.
- **users.json**: Stores user data (wallet addresses and aliases).
  
## Server Setup and Running

### Prerequisites
- Node.js (v14 or higher)
- Access to the filesystem for saving data.

### Installation
1. Clone the repository.
2. Install required dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on PORT `8000`.

ENV variables (set them up in .env file):
`CLIENT_URL` & `PORT`

## Endpoints

### `/auth`
- **Method**: `GET`
- **Query Parameters**:
  - `address`: Wallet address of the user.
- **Description**: Registers a new user if the wallet address doesn't exist, generating a random alias for them. If the address is already registered, it returns the existing user.

### `/invoice`
- **Method**: `GET`
  - **Query Parameters**:
    - `id`: The ID of the invoice to retrieve.
    - `to`: The recipient's address to filter invoices.
    - `requester`: The requester’s address to filter invoices.
- **Method**: `POST`
  - **Body**: The invoice data in JSON format.
- **Description**: 
  - `GET`: Fetches a specific invoice by ID, or invoices filtered by the recipient or requester.
  - `POST`: Creates a new invoice, assigns it an ID, and stores it in the database.

### `/receipt`
- **Method**: `POST`
  - **Body**: The receipt data in JSON format.
- **Description**: Marks an invoice as paid and creates a receipt, which is stored alongside the invoice.

### `/users`
- **Method**: `GET`
- **Description**: Returns the list of all users in the system.

## In Progress: Celestia Network Integration
Currently, the system uses a local file-based approach for storing invoices. However, we are working on integrating the **Celestia network** to store invoices in a decentralized manner. This feature is still under development, and updates will be provided when it's ready.

## Example of Data Structure
### Invoice (POST /invoice)
```json
{
  "id": 1,
  "type": "invoice",
  "to": "address123",
  "requester": "address456",
  "amount": 1000,
  "currency": "USD",
  "description": "Payment for services rendered"
}
```

### Receipt (POST /receipt)
```json
{
  "type": "receipt",
  "invoiceId": 1,
  "status": "paid"
}
```

### User (GET /users)
```json
[
  {
    "name": "Phoenix",
    "walletAddress": "address123",
    "twitter": "@Phoenix"
  },
  {
    "name": "Echo",
    "walletAddress": "address456",
    "twitter": "@Echo"
  }
]
```

## Development Notes
- **Data Storage**: Currently, the system stores all data in JSON files. In the future, invoice data will be migrated to the Celestia network for decentralized storage. Check https://www.quicknode.com/docs/celestia/blob.submit
- **Authentication**: Users are authenticated via their wallet address. If a user doesn't exist, they are created with a random alias.

## Contact
For more information or to report issues, please reach out to the project maintainers at `support@invoice-system.com`.
