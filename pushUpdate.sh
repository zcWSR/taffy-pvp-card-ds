#!/bin/bash

set -eo pipefail

cd $GITHUB_WORKSPACE/taffy-pvp-card-ds

git config --global user.name 'github-actions'
git config --global user.email 'github-actions@github.com'
git add .

if [ -n "`git status -s`" ]; then
    git commit -m "update at `date +"%Y-%m-%d %H:%M:%S"`"
    git push

    COMMIT_FILES=`echo "[$(git log -1 --pretty=format:'' --name-only | sed -e '$!s/\(.*\)$/"\1",/' -e '$s/\(.*\)$/"\1"/' | tr -d "\n")]"`
    curl -X POST http://qqbot.zcwsr.com/japari/message \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"genshinUpdate\",\"data\":$COMMIT_FILES}"
fi