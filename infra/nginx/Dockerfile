FROM nginx:1.27-alpine

# Install inotify-tools (very small on Alpine)
RUN apk add --no-cache inotify-tools

# Copy config
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d
COPY reloader.sh /usr/local/bin/reloader.sh

RUN chmod +x /usr/local/bin/reloader.sh

# Run nginx in foreground + start reloader
CMD ["sh", "-c", "nginx -g 'daemon off;' & /usr/local/bin/reloader.sh"]
