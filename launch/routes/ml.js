const http = require('http');
const util = require('util')
var ml=require('../ml/MachineLearning.js');
http.createServer((req, res) => {

    // 1. Tell the browser everything is OK (Status code 200), and the data is in plain text.
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    console.log(`Hello, yo`);
    // 2. Write the announced text to the body of the page
    res.write('Hello, World!\n');

    // 3. Tell the server that all of the response headers and body have been sent
    res.end();

}).listen(process.env.PORT, process.env.IP);

var result=ml.InferRatings(
    
    {
        "Max14":{rating:2},
        "Marcus17":{rating:2},
        "Martin16":{rating:5},
        "Khoman6":{rating:2}
    
        
    },
    [
     {       "GameID" : 1, 
              "TeamA" : ["Max14", "Marcus17"], 
              "TeamB" : ["Martin16", "Khoman6", "Joeseph9"], 
              "ScoreA" : 0, 
              "ScoreB" : 1,
        }
    ]
    );
    
  
    console.log(util.inspect(result, false, null))