FROM python:3.11-alpine AS runtime

# Security: create unprivileged user
RUN adduser -D appuser

# Install pip packages (requests is very small)
RUN pip install --no-cache-dir requests

WORKDIR /app
COPY app.py .

# Fix permissions
RUN chown -R appuser:appuser /app

USER appuser

CMD ["python", "-u", "app.py"]