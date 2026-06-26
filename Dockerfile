FROM node:20-alpine

WORKDIR /app

# Copy package management files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend files
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY utils/ ./utils/
COPY server.js ./
COPY syncSuperadmin.js fetch_casinos.cjs ./

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
