#!/bin/bash

# WARNING this script may not work on other distos than ubuntu!

source ./env.sh
MANAGER_IP=$(hostname -I | awk '{print $1}')
NETWORK=private

# To create the swarm
docker swarm init --advertise-addr "$MANAGER_IP"

# let's create the private network
docker network create --driver overlay "$NETWORK"