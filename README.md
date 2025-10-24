<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Executing in development mode

### 1. Clone the repository

### 2. Install the dependencies

```
npm run install
```

### 3. You must have Nest CLI installed

```
npm install -g @nestjs/cli
```

### 4. Set up database

```
docker compose up -d
```

### 5. The `.env.template` file

- Clone the `.env.template` file and change the name of that copy to `.env`
- Fill de enviroment variables with the correct data

### 6. Initialize the project

```
npm run start:dev
```

### 7. Populate de database with seed data

```
http://localhost:3000/api/v2/seed
```

## Stack

- MongoDB
- NestJS
- TypeScript
- Node

# Prod Build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
