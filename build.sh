#!/bin/bash

if [[ $UID -ne 0 ]]; then
    echo 'use sudo!'
    exit 1
fi

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
great
boring
beautiful
mesmerizing
WORDLIST
);

# Creating app.sql file for db container
SQL_FILE=docker/db/app.sql

cat > "$SQL_FILE" <<SQL
CREATE TABLE IF NOT EXISTS $CURRENT_BRANCH (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    word varchar(255) NOT NULL
);
SQL

toAppend=''
for w in $WORDS; do 
    toAppend="$toAppend\nINSERT INTO ${CURRENT_BRANCH} (word) VALUES ('${w}');";
done
echo -e "$toAppend" >> "$SQL_FILE"

# Copying files to app folder
APP_FOLDER="docker/app"
cp -vu {index,dao}.js package.json "$APP_FOLDER"

docker-compose up -d

rm -v "$APP_FOLDER"/*{js,json}

echo "THAT'S ALL FOLKS!"
