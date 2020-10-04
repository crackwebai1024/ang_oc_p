#!/bin/bash

# Remove @angular/* packages
echo Removing @angular packages...
npm uninstall @angular/animations @angular/common @angular/compiler @angular/core @angular/forms @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/router @angular/compiler-cli @angular/language-service
echo
echo

# Install @angular/* packages
echo Installing @angular packages...
npm install @angular/animations @angular/common @angular/compiler @angular/core @angular/forms @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/router
npm install @angular/compiler-cli @angular/language-service -D
echo
