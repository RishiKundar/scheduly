FROM node:20-alpine as BUILDER

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

from nginx:stable-alpine

# Remove the default Nginx config and static files
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=BUILDER /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
