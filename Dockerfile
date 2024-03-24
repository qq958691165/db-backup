FROM node:lts
LABEL authors="Jack"

COPY . /app/
WORKDIR /app

RUN yarn

ENTRYPOINT ["yarn", "start", "backup"]