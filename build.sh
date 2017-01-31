#!/bin/bash

if [[ $UID -ne 0 ]]; then
    echo 'use sudo!'
    exit 1
fi

source ./env.sh

cp -v {index,dao}.js package.json docker/app
cp -v dispatcher.js docker/dispatcher

docker-compose build --force-rm

rm -v docker/app/*{js,json} docker/dispatcher/*js

echo "THAT'S ALL FOLKS!"
