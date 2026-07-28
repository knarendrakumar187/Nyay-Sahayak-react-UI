FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "api.py"]
