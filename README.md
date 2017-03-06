TeamChooser is an android application that creates teams for pick up games. The goal is to ensure game quailty by providing two fairly balanced teams according to each player's past performance.

Server-TeamChooser is the backend logic of the application. It listens to all front end clients and stores data persistently in MongoDB. A machine learning module is the key computing compoenet which 'studies' players's past perforamce and infer ratings for each player.

Based on the ratings, the mobile application is able to divide participating players into two equally strong teams.
