# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Копирует package.json и lockfile
COPY package*.json ./

# Установим зависимости
RUN npm install

# Копирует остальной код
COPY . .

# Собирает проект NestJS
RUN npm run build


# --- Stage 2: Production run ---
FROM node:20-alpine

WORKDIR /app
