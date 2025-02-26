FROM node:20.9.0-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20.9.0-alpine AS deployer

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

# Install production dependencies only
RUN npm ci --production

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]
