# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Скопируем package.json и lockfile
COPY package*.json ./

# Установим зависимости
RUN npm install

# Скопируем остальной код
COPY . .

# Собираем проект NestJS
RUN npm run build


# --- Stage 2: Production run ---
FROM node:20-alpine

WORKDIR /app

# Скопируем собран
