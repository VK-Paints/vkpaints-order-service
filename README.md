# VK-Paints Order Service

## Description
Manages customer orders and publishes notification events to RabbitMQ.

## Tech Stack
- Node.js & Express
- PostgreSQL & Sequelize
- RabbitMQ (amqplib)

## Environment Variables
- PORT: Service port (default 3004)
- DB_URL: PostgreSQL connection string
- RABBITMQ_URL: Message broker connection string

## Features
- Order creation and tracking
- Event-driven notifications via RabbitMQ
