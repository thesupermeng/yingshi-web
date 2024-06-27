FROM node:lts-alpine

# set timezone to GMT+8
RUN apk update
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build 
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]