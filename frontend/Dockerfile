FROM node:14-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --no-optional

COPY . .

RUN npm run build

FROM node:14.17-slim

WORKDIR /app
COPY --from=0 /app/build ./build
COPY --from=0 /app/node_modules ./node_modules
COPY package.json package-lock.json ./

ENV PORT 3030

EXPOSE 3030
CMD ["node", "./build"]