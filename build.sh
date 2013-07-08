#!/bin/sh
built=false

if [ $1 == "chrome" ] || [ $1 == "all" ]; then
  echo "Building XKit for Chrome"
  rm -rf build/chrome
  mkdir -p build/chrome
  cp Chrome/* build/chrome/
  cp *.js build/chrome
  cp *.css build/chrome
  built=true
fi
if [ $1 == "safari" ] || [ $1 == "all" ]; then 
  echo "Building XKit for Safari"
  rm -rf build/XKit.safariextension
  mkdir -p build/XKit.safariextension
  cp Safari/* build/XKit.safariextension/
  cp *.js build/XKit.safariextension
  cp *.css build/XKit.safariextension
  built=true
fi 
if [ $built == false ]; then
  echo "'$1' is not a valid build target."
fi
     

# mkdir build/chrome/Extensions
# cp Extensions/* build/chrome/Extensions
