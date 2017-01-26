#!/bin/bash

if [[ $UID -ne 0 ]]; then
    echo 'you must use sudo'
    exit 1
fi

#define CURRENT_BRANCH, TAG and all MYSQL_* vars
source ../common.sh

CONTAINER_NAME="${CONTAINER_NAME_PREFIX}/${CURRENT_BRANCH}"

if [[ "$1" = 'clean' ]]; then
    for i in $(docker images ${CONTAINER_NAME} -q); do docker rmi -f ${i}; done;
    exit 0;
fi

echo "Building ${CONTAINER_NAME}:${TAG}"

cp -v ../../{index,dao}.js ../../package.json . 

docker build --force-rm -t ${CONTAINER_NAME}:${TAG} -t ${CONTAINER_NAME}:latest .

rm -v ./{index,dao}.js package.json

docker run --rm -it -p '3000:3000' \
    -e MYSQL_HOST=${MYSQL_HOST} \
    -e MYSQL_USER=${MYSQL_USER} \
    -e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
    -e MYSQL_DATABASE=${MYSQL_DATABASE} \
    --link ${MYSQL_HOST} \
    --name ${CURRENT_BRANCH} ${CONTAINER_NAME}
