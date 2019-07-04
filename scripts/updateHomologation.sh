#!/bin/sh
echo "Updating homologation..."
USER=estudante
PASSWD=estudante
SERVER_BUILD="caesar-server-build.tar.gz"
CLIENT_BUILD="caesar-client-build.tar.gz"
SERVER_FOLDER="server/"
CLIENT_FOLDER="client/"

cd "../server"
sshpass -p $PASSWD ssh $USER@177.44.248.15 <<EOF
  cd ~/caesar
  tar -zxvf $SERVER_BUILD
  cp -r migrations $SERVER_FOLDER/
  rm -rf migrations
  cp -r src $SERVER_FOLDER/
  rm -rf src
  cp -r package.json $SERVER_FOLDER/
  rm -rf package.json
  rm $SERVER_BUILD
  echo "Starting server..."
  cd $SERVER_FOLDER
  npm i
  npm run server &
  cd ../../
EOF
echo "Update finished!"