# Start from a base image with Node.js (Bun.js requires Node.js environment)
FROM node:latest

# Install LaTeX
RUN apt-get update && \
    apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra && \
    apt install curl -y

ENV hi="asdf"

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Create app directory
WORKDIR /app

# Copy the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["/root/.bun/bin/bun","app.js"] 
