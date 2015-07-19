#!/bin/bash
git merge master -m "Merge master"
node ./Extensions/dist/extensions.js ./Extensions ./Extensions/dist
git add Extensions
git commit -m "Rebuild distribution"
git push
