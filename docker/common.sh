#!/bin/bash

export CURRENT_BRANCH=$(git branch | grep \* | cut -d' ' -f2)
export TAG=$(echo $RANDOM | sha1sum | cut -d' ' -f1)
export CONTAINER_NAME_PREFIX="cpe-ws-docker"
export MYSQL_HOST="${CURRENT_BRANCH}_db"
export MYSQL_ROOT_PASSWORD="p4ssw0rD"
export MYSQL_USER="${CURRENT_BRANCH}_u"
export MYSQL_PASSWORD="pwd_${CURRENT_BRANCH}_u"
export MYSQL_DATABASE="$CURRENT_BRANCH"

## TO MODIFY
WORDS=$(cat<<WORDLIST
eats
walks
sleeps
WORDLIST
);
