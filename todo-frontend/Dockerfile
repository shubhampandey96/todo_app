# Stage 1: Build React app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Set working directory to nginx html folder
WORKDIR /usr/share/nginx/html

# Copy build files from previous stage
COPY --from=build /app/build .

# Copy custom nginx config if needed
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
