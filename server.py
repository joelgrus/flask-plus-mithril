from flask import Flask
# you need to pip install flask-cors, or else you'll run into problems
from flask.ext.cors import CORS, cross_origin
import json
import math

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/graph/<wave>/points/<int:num_points>')
@cross_origin()
def return_points(wave, num_points):
    """returns sin or cos (or id) wave,
    with specified number of points between 0 and 2 pi"""
    print num_points
    if num_points <= 0: return json.dumps([]);

    xs = [i * 2 * math.pi / num_points for i in range(num_points + 1) ]

    def f(x):
        if wave.lower() == 'sin':
            return math.sin(x)
        elif wave.lower() == 'cos':
            return math.cos(x)
        else:
            return x

    return json.dumps([{ 'x' : x, 'y' : f(x)} for x in xs])

if __name__ == '__main__':
    app.run()
