FROM node:14-alpine 
COPY ./app /app

WORKDIR  /app

RUN yarn \
    && yarn build 
CMD ["yarn", "start"]