
FROM node:20-buster
WORKDIR /app
COPY package*.json ./ 
RUN npm ci --only=production


RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# RUN sudo apt-get install libgtk2.0-0 libgtk-3-0 libnotify-dev
# RUN sudo apt-get install libgconf-2-4 libnss3 libxss1

ENV NODE_ENV production

COPY . .

# node 이미지에 이미 "node"라는 사용자가 uid/gid 1000번으로 생성되어 있음
USER node

EXPOSE 3000
CMD Xvfb :99 -screen 0 1024x768x16 -ac & node dist/src/main.js
