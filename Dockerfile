FROM node:latest
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD serve -s build --ssl-key=/config/tomioka.ru.key --ssl-cert=/config/tomioka.ru.crt -p 443
