
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
        map: mapInfo.map
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
  // TODO: Save map to file
  const map = req.body.map;
  const fileName = req.body.fileName;
  const savedData = {
    map
  }

  fs.writeFile('./map_files/' + fileName + '.json', JSON.stringify(savedData), 'utf8', (success) => {
    res.sendStatus(200);
  });
})

app.get('/api/stats', (req, res) => {
  res.send({
    gumption: 10,
    resilience: 10
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));
