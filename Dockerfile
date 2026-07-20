FROM denoland/deno:alpine-1.42.0

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Cache dependencies (optional but recommended)
RUN deno cache apps/api/src/main.ts

# Expose the port
EXPOSE 8000

# Set environment variable for Deno to listen on all interfaces
ENV PORT=8000

# Run the API
CMD ["deno", "run", "-A", "apps/api/src/main.ts"]
