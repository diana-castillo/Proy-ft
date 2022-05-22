from flask import Flask, render_template, request, make_response, jsonify
import os
import socket
import random
import logging
import psycopg2


host = "postgresql.diana2206-dev.svc.cluster.local"
conexion = psycopg2.connect(dbname="votingApp", user="Diana", password="220600dfcr", host=host)
cursor1 = conexion.cursor()

hostname = socket.gethostname()
option_a = os.getenv('OPTION_A', "Cats")
option_b = os.getenv('OPTION_B', "Dogs")

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

voter_id = None

@app.route("/", methods=['POST','GET'])
def hello():   
    global voter_id 
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]
    vote = None    
   

    if request.method == 'POST':
        vote = request.form['vote']
        print(vote)
        app.logger.info('Received vote for %s', vote)
        buscar = "SELECT COUNT(*) FROM votos WHERE voter_id = %s;"
        cursor1.execute(buscar, (voter_id,))
        
        if cursor1.fetchone()[0] == 1:
            actualizar = "UPDATE votos SET vote = %s WHERE voter_id = %s"
            cursor1.execute(actualizar, (vote, voter_id))
        else:
            insertar = "INSERT INTO votos (voter_id, vote) VALUES (%s, %s);"
            cursor1.execute(insertar, (voter_id, vote))
        conexion.commit()
    resp = make_response(render_template(
        'index.html',
        option_a=option_a,
        option_b=option_b,
        hostname=hostname,
        vote=vote,
        voter_id = voter_id
    ))
    return resp

@app.route("/cargar_id/<string:id>", methods=['GET','POST'])
def hola(id = None):
    if request.method == "POST" and id is not None:
        global voter_id 
        voter_id = id
    return jsonify(code = 'ok')
    

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True, threaded=True)

conexion.close()