# Stage 1: Build the app with Node
# Copies the dependency manifest and installs NPM dependencies
# Copies the rest of the project files and builds the project
FROM node:alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Serve the built application with NGINX
# Copies the compiled app from build stage, into the serve dir
# Exposes the default NGINX port 80
# And then starts NGINX in the foreground
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
