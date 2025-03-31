# Travel Agent Setup Guide

## Prerequisites for Frontend
- Node.js
- Docker 

## Repository
[Travel Agent GitHub Repository](https://github.com/Adi-Senku69/Travel_Agent.git)
---
## Go to Releases page

## Setup Backend

1. Download the required files:
   - `travel-agent-rc.tar`
   - `fast-api-rc.tar`

2. Load the Docker images:
   ```sh
   docker load -i travel-agent-rc.tar
   docker load -i fast-api-rc.tar
   ```

3. Run the backend services:
   ```sh
   docker compose up
   ```
