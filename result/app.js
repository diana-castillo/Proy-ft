const { timeEnd } = require('console')
const express = require('express')
const app = express()
const path = require('path')
const { Client } = require('pg')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    const connectionData = {
        user: 'Diana',
        host: 'postgresql.diana2206-dev.svc.cluster.local',
        database: 'votingApp',
        password: '220600dfcr',
        port: 5432,
      }
    
    const client = new Client(connectionData);
    client.connect();
    
    client.query("SELECT vote, COUNT(voter_id) AS count FROM votos GROUP BY vote", 
        function(err,result){
            if(err){
                throw err;
            }
            else{
                var votes = collectVotesFromResult(result);
                var total = votes.a + votes.b;
                var cats_percent, dogs_percent, div_izq, div_der;
        
                if(total == 0){
                    cats_percent = 0;
                    dogs_percent = 0;
                    div_izq = 50;
                    div_der = 50;
                }
                else{
                    cats_percent = (votes.a*100)/total;
                    dogs_percent = (votes.b*100)/total;
                    div_izq = cats_percent;
                    div_der = dogs_percent;
                }

                if(total == 1)
                    var total_string = total + " voto"
                else
                    var total_string = total + " votos"
                
                res.render("index", 
                {
                    total: total_string,
                    cats_percent: cats_percent.toFixed(2),
                    dogs_percent: dogs_percent.toFixed(2),
                    div_izq: div_izq.toFixed(2),
                    div_der: div_der.toFixed(2)
                });
            }
        }
        
        )

    function collectVotesFromResult(result) {
        var votes = {a: 0, b: 0};
          
        result.rows.forEach(function (row) {
            votes[row.vote] = parseInt(row.count);
        });
          
        return votes;
    }
  
})

app.listen(3000)