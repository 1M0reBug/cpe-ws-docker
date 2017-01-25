#!/bin/bash

export CURRENT_BRANCH=$(git branch | grep \* | cut -d' ' -f2)
CONTAINER_NAME="cpe-ws-docker/${CURRENT_BRANCH}"
TAG=$(echo $RANDOM | sha1sum | cut -d' ' -f1)

if [[ $UID -ne 0 ]]; then
    echo 'you must use sudo'
    exit 1
fi

if [[ "$1" = 'clean' ]]; then
    for i in $(docker images ${CONTAINER_NAME} -q); do docker rmi -f ${i}; done;
    exit 0;
fi

echo "Building ${CONTAINER_NAME}:${TAG}"
docker build --force-rm -t ${CONTAINER_NAME}:${TAG} -t ${CONTAINER_NAME}:latest .

docker run --rm -it -p '3000:3000' --name ${CURRENT_BRANCH} ${CONTAINER_NAME}
