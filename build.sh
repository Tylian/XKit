echo "Build XKit for Chrome"
rm -rf build

mkdir -p build/chrome
cp Chrome/* build/chrome/
cp *.js build/chrome
cp *.css build/chrome

# mkdir build/chrome/Extensions
# cp Extensions/* build/chrome/Extensions
