#!/bin/bash
node ./Extensions/dist/extensions.js ./Extensions ./Extensions/dist
git add Extensions
git commit
git push
