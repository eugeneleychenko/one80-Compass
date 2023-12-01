from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/run-script')
def run_script():
    # Your Python script logic here
    result = {'message': 'Script ran successfully'}
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)