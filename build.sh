#!/bin/sh
cd $TRAVIS_BUILD_DIR/ServerProgramming/myapp
npm install
mocha
