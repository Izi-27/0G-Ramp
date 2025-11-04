FROM node:18-alpine
WORKDIR /app

# Install dependencies first (copy from backend subdir because build context is repo root)
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend source code only
COPY backend/ ./

# Generate Prisma client and apply schema on startup
RUN npx prisma generate

EXPOSE 3001
# For Postgres-backed deployments, push the Prisma schema at startup.
# If you later adopt migrations, switch to `prisma migrate deploy`.
CMD sh -c "npx prisma db push && node server.js"