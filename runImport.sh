#!/bin/bash 

mongoimport --db hockey --collection users --type csv --file /Users/JHUA/school_porj/Server-TeamChooser/users.csv --headerline
mongoimport --db hockey --collection gameInstances --type csv --file /Users/JHUA/school_porj/Server-TeamChooser/gameInstances.csv --headerline
