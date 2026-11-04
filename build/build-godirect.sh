#!/bin/sh
USERNAME=msheppardadn
# Image name
IMAGE=godirect
platformlower=prod
#
echo "You are building: Harbour Nest"
#
echo "Now removing...."
rm -r dist
echo "Now copying..."
cp -r ../app/www dist
#
DOCKERFILE=build$platformlower
VERSION=`cat dist/assets/config/adf.json | grep release | awk '{print $2}' | sed 's/"//g'`
TEXT=v.$platformlower.$VERSION
#
# For some reason in WSL 2 $TEXT Value has a /r appended to it!  The following line removes it
# 
FULL_VER=$(echo $TEXT | sed -e 's/\r//g')
#
docker build -t $USERNAME/$IMAGE:$FULL_VER -f $DOCKERFILE/Dockerfile .
#
docker push $USERNAME/$IMAGE:$FULL_VER