
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express();
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/map', (req, res) => {
  const mapName = req.query.mapName;

  if (mapName) {
    fs.readFile('./map_files/' + mapName + '.json', (err, data) => {
      if (err) throw err;
      const mapInfo = JSON.parse(data);
      res.send({
        coords: {
          x: 0,
          y: 0
        },
        map: mapInfo.map,
        northMap: mapInfo.northMap || '',
        eastMap: mapInfo.eastMap || '',
        southMap: mapInfo.southMap || '',
        westMap: mapInfo.westMap || ''
      })
    });
  }
  else {
    map = new Array(30).fill(new Array(30).fill(0))
    res.send({
      coords: {
        x: 0,
        y: 0
      },
      map: map
    })
  }
})

app.post('/api/map', (req, res) => {
  const map = req.body.map;
  const {northMap, eastMap, southMap, westMap} = req.body;
  const overwrite = req.body.shouldOverwrite;
  const fileName = './map_files/' + req.body.fileName + '.json';
  const savedData = {
    map,
    northMap,
    eastMap,
    southMap,
    westMap
  }

  if (!overwrite && fs.existsSync(fileName)) {
    res.status(409).send("This file already exists; please choose a different file name.");
  }
  else {
    fs.writeFile(fileName, JSON.stringify(savedData), 'utf8', (success) => {
      res.sendStatus(200);
    });
  }
})

app.get('/api/stats', (req, res) => {
  res.send({
    gumption: 10,
    resilience: 10
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));
