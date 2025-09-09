
FROM node:22.4.1 AS builder
WORKDIR /app
# Copy package.json and optionally yarn.lock (if it exists)
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code and build the app
COPY . ./
RUN yarn build

# Stage 2: Serve 
FROM nginx:alpine


# Remove default NGINX config and copy the custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the React app build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
ENV REACT_APP_ENV=prod

# Expose the port NGINX will serve on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

