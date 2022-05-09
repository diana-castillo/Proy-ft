const express = require('express');
const app = express();
const path = require('path');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const fs = require('fs');

const { Client } = require('pg')

app.use(express.static(path.join(__dirname, 'stylesheets')));


app.get('/', function (req, res) {
  
  //Conexion DB
  const connectionData = {
    user: 'postgres',
    host: 'localhost',
    database: 'votingApp',
    password: '220600dfcr',
    port: 5432,
  }

  const client = new Client(connectionData);
  client.connect();

  client.query("SELECT vote, COUNT(voter_id) AS count FROM votos GROUP BY vote", 
    function(err,result){
    if(err) {
        throw err;
    }
    else {
      var votes = collectVotesFromResult(result);
      //Modificar HTML
      html = fs.readFileSync('index.html').toString()
      id_dom = new JSDOM(html)

      total = votes.a + votes.b;
      porcentaje_a = (votes.a*100)/total;
      porcentaje_b = (votes.b*100)/total;
      id_dom.window.document.getElementById("catstats").innerHTML = porcentaje_a.toFixed(2) + "%";
      id_dom.window.document.getElementById("dogstats").innerHTML = porcentaje_b.toFixed(2) + "%";

      div1 = id_dom.window.document.getElementById('background-stats-1');
      div2 = id_dom.window.document.getElementById('background-stats-2');
      
      if(total > 0){
        div1.style.width = (votes.a*100)/total + "%"
        div2.style.width = (votes.b*100)/total + "%"
      }
      else{
        div1.style.width = "50%"
        div2.style.width = "50%"
      }
      

      t_votos= id_dom.window.document.getElementById('total')
      if(total == 0)
        t_votos.innerHTML = "0 votos";
      
      if(total == 1)
        t_votos.innerHTML = "1 voto";

      if(total > 1)
      t_votos.innerHTML = total + " votos";

      fs.writeFileSync(__dirname + '/index.html', id_dom.serialize());
    }
    })

    function collectVotesFromResult(result) {
        var votes = {a: 0, b: 0};
      
        result.rows.forEach(function (row) {
          votes[row.vote] = parseInt(row.count);
        });
      
        return votes;
    }


  res.sendFile(path.join(__dirname + '/index.html'));

})


app.listen(3000)