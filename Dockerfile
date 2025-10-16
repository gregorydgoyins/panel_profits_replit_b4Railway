FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
WORKDIR /app/server
ENV NODE_ENV=production
# Render sets PORT dynamically; app reads process.env.PORT
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT:-8080}/__health || exit 1
CMD ["node", "index.js"]
