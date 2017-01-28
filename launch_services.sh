#!/bin/bash

if [[ $UID -ne 0 ]]; then
    echo 'use sudo!'
    exit 1
fi

source ./env.sh

NETWORK="private"

# now launching 2 services on the swarm (could be everywhere): db
docker service create --name "db" --replicas 1 \
    --network "$NETWORK" \
    "${CONTAINER_NAME_PREFIX}/db"

for service in adjectives verbs nouns; do
    docker service create --name "${service}" --replicas 2 \
        --network "$NETWORK" \
        "${CONTAINER_NAME_PREFIX}/${service}"
done

docker service create --name "dispatcher" --replicas 1 \
    --network "$NETWORK" \
    -p 8000:8000 \
    "${CONTAINER_NAME_PREFIX}/dispatcher"
