FROM node:7.4.0-alpine
LABEL maintainer "jordan.quagliatini@gmail.com"

ENV NODE_ENV "production"

WORKDIR /usr/src/${CURRENT_BRANCH}
ADD ./*js \
    package.json \
    ./

RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]