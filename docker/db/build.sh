#!/bin/bash

if [[ $UID -ne 0 ]]; then
    echo 'Use sudo';
    exit 1;
fi

# define CURRENT_BRANCH, TAG, WORDS and all MYSQL_* vars
source ../common.sh

CONTAINER_NAME="${CONTAINER_NAME_PREFIX}/${MYSQL_HOST}"

cat > app.sql <<SQL
CREATE TABLE IF NOT EXISTS $CURRENT_BRANCH (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);
SQL

toAppend=''
for w in $WORDS; do 
    toAppend="$toAppend\nINSERT INTO ${CURRENT_BRANCH} (word) VALUES ('${w}');";
done
echo -e "$toAppend" >> app.sql

echo "Building ${CONTAINER_NAME}:${TAG}"
docker build --force-rm -t ${CONTAINER_NAME}:${TAG} -t ${CONTAINER_NAME}:latest .
docker run --rm -it -p "3306:3306" \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    -e MYSQL_USER=${MYSQL_USER} \
    -e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
    -e MYSQL_DATABASE=${MYSQL_DATABASE} \
    --name ${MYSQL_HOST} ${CONTAINER_NAME}
