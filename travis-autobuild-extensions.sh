#!/bin/bash

if [ "$TRAVIS_REPO_SLUG" == "new-xkit/XKit" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
  echo -e "Rebuilding extension dist...\n" &&\

  cd $HOME &&\
  git config --global user.email "travis@travis-ci.org" &&\
  git config --global user.name "travis-ci" &&\
  git clone https://"$GH_TOKEN"@github.com/new-xkit/XKit &&\
  cd XKit &&\
  git checkout gh-pages &&\
  git merge master -m "Merge master $TRAVIS_COMMIT" &&\
  npm install -g gulp &&\
  npm install &&\
  gulp build:extensions &&\
  gulp build:themes &&\
  git add Extensions &&\
  git commit -m "Rebuild distribution based on $TRAVIS_COMMIT" &&\
  git push -fq origin gh-pages > /dev/null &&\

  echo -e "Rebuilt extension dist.\n"
fi
