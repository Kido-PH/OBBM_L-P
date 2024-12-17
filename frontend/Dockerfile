# 1. For building the React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install dependencies using npm ci for clean install
RUN npm ci

# Copy the entire project to the container
COPY . /app

# Set environment variables
ENV CI=true
ENV PORT=3000

# Run the development server (if needed during dev stage)
CMD [ "npm", "start" ]

# Build stage
FROM development AS build

# Increase Node.js heap size and build the app
RUN REACT_APP_ENV=production DISABLE_ESLINT_PLUGIN=true NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 2. For Nginx setup
FROM nginx:alpine

# Copy custom nginx configuration from the build stage
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Set working directory to Nginx's HTML directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy the React app's build output from the builder stage
COPY --from=build /app/build .

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
