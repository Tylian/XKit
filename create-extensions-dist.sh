#!/bin/bash
git checkout gh-pages &&\
git merge master -m "Merge master" &&\
node ./Extensions/dist/extensions.js ./Extensions ./Extensions/dist &&\
git add Extensions &&\
git commit -m "Rebuild distribution" &&\
git push &&\
git checkout master
