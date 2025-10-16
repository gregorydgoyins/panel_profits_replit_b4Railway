FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
WORKDIR /app/server
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.js"]
