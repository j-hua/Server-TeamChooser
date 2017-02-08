const http = require('http');
const util = require('util')
var ml=require('./MachineLearning.js');




module.exports.invokeML= function invokeML(inputallplayer,inputallmatch){
/*
var inputallplayer={
  "allPlayers": [
    {
      "_id": "588aca612bafce21ae65905d",
      "playerId": "Max14",
      "rating":2,
      "name": "Jef"
    },
    {
      "_id": "588acb2982a50521d995253e",
      "playerId": "Marcus17",
      "rating": 2,
      "name": "YEEE"
    },
    {
      "_id": "588acbe5edbbb5227a3f7b21",
      "playerId": "Khoman6",
      "rating": 2,
      "name": "YEEE"
    },
    {
      "_id": "588acbe5edbbb5227a3f7b21",
      "playerId": "Martin16",
      "rating": 5,
      "name": "YEEE"
    }
  ]
};

var inputallmatch=
    [
    {
        "_id":1, 
        "teamA":{
            "players": [{
                            "playerId":"Max14",
                            "rating":2,
                            "name":"jj"
                    },{
                            "playerId":"Marcus17",
                            "rating":2,
                            "name":"aa"
                    }],
            "score": 0
        },
        "teamB": {
            "players": [{
                            "playerId":"Martin16",
                            "rating":5,
                            "name":"vv"
                    },{
                            "playerId":"Khoman6",
                            "rating":2,
                            "name":"jj"
                    }],
         "score": 1
        }

    }
    ,
    {

        "_id":2,    
        "teamA":{
            "players": [{
                            "playerId":"Max14",
                            "rating":2,
                            "name":"jj"
                    },{
                            "playerId":"Marcus17",
                            "rating":2,
                            "name":"aa"
                    }],
            "score": 0
        },
        "teamB": {
            "players": [{
                            "playerId":"Martin16",
                            "rating":5,
                            "name":"vv"
                    },{
                            "playerId":"Khoman6",
                            "rating":2,
                            "name":"jj"
                    }],
         "score": 1
        }

    }
    ];



*/
//var inputallplayerString=JSON.parse(inputallplayer);

var ratings_prev={};//all players + rating, to be sent to machine learning algorithm
var game_instances=[];//this is array of all match instances in a game

//parse allplayers to format fo rating_prev
for (var i = 0; i <inputallplayer.allPlayers.length; i++) {
    var playerId=inputallplayer.allPlayers[i].playerId;
    var each_rating={rating:inputallplayer.allPlayers[i].rating};
    ratings_prev[playerId]=each_rating;

}


//parse all matches to game_instances
for (var i = 0; i<inputallmatch.length;i++){
    var each_match={};
    var teamA_array=[];
    var teamB_array=[];
    each_match.GameID=inputallmatch[i]._id;

    for (var j = 0; j<inputallmatch[i].teamA.players.length;j++){
        teamA_array[j]=inputallmatch[i].teamA.players[j].playerId;
    }
    for (var k = 0; k<inputallmatch[i].teamB.players.length;k++){
        teamB_array[k]=inputallmatch[k].teamB.players[k].playerId;
    }

    each_match.TeamA=teamA_array;
    each_match.TeamB=teamB_array;

    each_match.ScoreA=inputallmatch[i].teamA.score;
    each_match.ScoreB=inputallmatch[i].teamB.score;
    //console.log("each_match\n"+util.inspect(each_match, false, null));
    game_instances[i]=each_match;
}


//console.log("ratings_prev\n"+util.inspect(ratings_prev, false, null));
//console.log("game_instances\n"+util.inspect(game_instances, false, null));

var result=ml.InferRatings(ratings_prev,game_instances);
var result_arr=[];
var count=0;
for(var n in result){
    var each_rating={};
  //  console.log("each_rating"+util.inspect(n, false, null));
    each_rating.playerId=n;
    each_rating.rating=result[n].rating;

    result_arr[count]=each_rating;
    count++;

}
    console.log("result_arr\n"+util.inspect(result_arr, false, null));
return result_arr;
    
}    

  
//console.log("result \n"+util.inspect(result, false, null));

  
//console.log("result arr \n"+util.inspect(result_arr, false, null));

//}



    /*
    format for rating prev
     {
        "Max14":{rating:2},
        "Marcus17":{rating:2},
        "Martin16":{rating:5},
        "Khoman6":{rating:2}   
    }
    
    format for game_instances
    [
     {       "GameID" : 1, 
              "TeamA" : ["Max14", "Marcus17"], 
              "TeamB" : ["Martin16", "Khoman6"], 
              "ScoreA" : 0, 
              "ScoreB" : 1,
        },
     {       "GameID" : 2, 
          "TeamA" : ["Max14", "Marcus17"], 
          "TeamB" : ["Martin16", "Khoman6"], 
          "ScoreA" : 0, 
          "ScoreB" : 1,
    }
    ]

   

    */
