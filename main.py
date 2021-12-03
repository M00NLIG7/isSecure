# Library imports
from typing import ContextManager
from flask import Flask, send_file, request
from flask_cors import CORS, cross_origin
from requests.models import requote_uri
import json
import requests
from requests.structures import CaseInsensitiveDict


API_KEY = '<REDACTEDD>'

# Creating Python Flask object (creates the server)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"

# Root function


@app.route('/')
def root():
    return json.dumps("home page")


# routes check_url method to /scan on localhost


@app.route('/scan', methods=["POST"])
def check_url():
    url = "https://www.virustotal.com/api/v3/urls"

    headers = CaseInsensitiveDict()
    headers["x-apikey"] = API_KEY
    headers["Content-Type"] = "application/x-www-form-urlencoded"

    data = f'url={request.get_json(force=True)["url"]}'

    resp = requests.post(url, headers=headers, data=data)

    print(resp.status_code)

    if resp.status_code == 200:
        id = resp.json()["data"]["id"]
        url = f'https://www.virustotal.com/api/v3/analyses/{id}'

        headers = CaseInsensitiveDict()
        headers["x-apikey"] = API_KEY

        resp = requests.get(url, headers=headers)

        report = resp.json()

        safety_report = dict()

        if report["data"]["attributes"]["stats"]["malicious"] > 0:
            safety_report["msg"] = "This website is dangerous"
        elif report["data"]["attributes"]["stats"]["suspicious"] > 0:
            safety_report["msg"] = "This website is suspicious"
        else:
            safety_report["msg"] = "This website is probably safe"

        safety_report["harmless"] = report["data"]["attributes"]["stats"]["harmless"]
        safety_report["malicious"] = report["data"]["attributes"]["stats"]["malicious"]
        safety_report["suspicous"] = report["data"]["attributes"]["stats"]["suspicious"]

        print(report["data"]["attributes"]["stats"])

        return json.dumps(safety_report)
    else:
        return json.dumps("ERROR: Could not scan")


# Running/Starting the server
if __name__ == '__main__':
    app.run()
