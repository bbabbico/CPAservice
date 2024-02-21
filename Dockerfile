
FROM node:20-buster
WORKDIR /app
COPY package*.json ./ 
RUN npm ci --only=production

RUN apt update
RUN apt install chromium -y

# RUN sudo apt-get install libgtk2.0-0 libgtk-3-0 libnotify-dev
# RUN sudo apt-get install libgconf-2-4 libnss3 libxss1

ENV NODE_ENV production

COPY . .

# node 이미지에 이미 "node"라는 사용자가 uid/gid 1000번으로 생성되어 있음
USER node

EXPOSE 3000
CMD ["npm", "start"]
