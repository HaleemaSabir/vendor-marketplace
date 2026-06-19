# Database Schema

## Users
- id (string)
- name (string)
- email (string)
- password (string)
- role (customer/provider/admin)

## Services
- id (string)
- title (string)
- description (string)
- price (number)
- providerId (string)

## Orders
- id (string)
- serviceId (string)
- userId (string)
- status (pending/completed)