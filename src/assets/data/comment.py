import json

with open('queries.new.json', 'r+') as f:
    data = json.load(f)
    for n, query in data['tpcds'].items():
        data['tpcds'][n] = f'/* TPC-DS Query {n} */\n\n' + query

    f.seek(0)
    json.dump(data, f, indent=4)