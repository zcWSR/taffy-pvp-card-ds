#!/bin/bash

set -eo pipefail

cd $GITHUB_WORKSPACE/taffy-pvp-card-ds
git config --global user.name 'github-actions'
git config --global user.email 'github-actions@github.com'
git add .
if [ -n "`git status -s`" ]; then
    git commit -m "update at `date +"%Y-%m-%d %H:%M:%S"`"
    git push
    curl -X POST http://qqbot.zcwsr.com/japari/message -d "type=genshinUpdate"
fi