FROM node:20.5.1-bookworm-slim
USER node
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node ./ ./
CMD [ "npm", "run", "dev" ]