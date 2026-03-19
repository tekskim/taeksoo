# Build stage
FROM node:22.14.0-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.8.1

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.*.json global.d.ts ./
COPY .prettierrc .prettierignore eslint.config.js ./
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared/
COPY tsconfig.*.json ./
COPY global.d.ts ./
COPY .prettierrc .prettierignore eslint.config.js ./

# Clean and build storybook
RUN rm -rf packages/shared/dist-storybook && pnpm --filter @thaki/shared build-storybook

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/packages/shared/dist-storybook /usr/share/nginx/html

# Copy nginx base configuration
COPY nginx.base.conf /etc/nginx/base.conf

# Copy nginx configuration
COPY packages/shared/nginx.conf /etc/nginx/conf.d/default.conf

# Create SSL certificate directory
# SSL 사용 시 docker run에서 인증서 마운트 필요:
#   -v /path/to/cert.pem:/etc/nginx/ssl/cert.pem:ro
#   -v /path/to/key.pem:/etc/nginx/ssl/key.pem:ro
RUN mkdir -p /etc/nginx/ssl

# Configure non-root user for security (CWE-250)
RUN apk add --no-cache libcap && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/ssl && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid && \
    setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx

USER nginx

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
