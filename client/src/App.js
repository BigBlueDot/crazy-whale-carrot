import React, { Component } from 'react';
import request from 'request';

import logo from './logo.svg';

import map_panel_0 from  './gfx/map_panel_0.png';
import map_panel_1 from  './gfx/map_panel_1.png';
import map_panel_2 from  './gfx/map_panel_2.png';
import map_panel_3 from  './gfx/map_panel_3.png';
import map_panel_4 from  './gfx/map_panel_4.png';
import map_panel_5 from  './gfx/map_panel_5.png';
import map_panel_6 from  './gfx/map_panel_6.png';
import map_panel_7 from  './gfx/map_panel_7.png';
import map_panel_8 from  './gfx/map_panel_8.png';
import map_panel_9 from  './gfx/map_panel_9.png';
import map_panel_10 from  './gfx/map_panel_10.png';
import map_panel_11 from  './gfx/map_panel_11.png';
import map_panel_12 from  './gfx/map_panel_12.png';
import map_panel_13 from  './gfx/map_panel_13.png';
import map_panel_14 from  './gfx/map_panel_14.png';
import map_panel_15 from  './gfx/map_panel_15.png';
import red_dot from './gfx/red_dot.png';

import './App.css';

const intToImage = {
  0: map_panel_0,
  1: map_panel_1,
  2: map_panel_2,
  3: map_panel_3,
  4: map_panel_4,
  5: map_panel_5,
  6: map_panel_6,
  7: map_panel_7,
  8: map_panel_8,
  9: map_panel_9,
  10: map_panel_10,
  11: map_panel_11,
  12: map_panel_12,
  13: map_panel_13,
  14: map_panel_14,
  15: map_panel_15,
}

const binaryToInt = {
  '0000': 0,
  '0001': 1,
  '0010': 2,
  '0011': 3,
  '0100': 4,
  '0101': 5,
  '0110': 6,
  '0111': 7,
  '1000': 8,
  '1001': 9,
  '1010': 10,
  '1011': 11,
  '1100': 12,
  '1101': 13,
  '1110': 14,
  '1111': 15,
};

let intToBinary = {};

Object.keys(binaryToInt).forEach(key => {
  intToBinary[binaryToInt[key]] = key;
})

class App extends Component {
  state = {
    gumption: '',
    resilience: '',
    mapCoordsX: 0,
    mapCoordsY: 0,
    map: [],
    makerX: 0,
    makerY: 0,
    mapName: '',
    mode: 'W',
    showLoadMapText: false,
    loadMapName: ''
  };

  componentDidMount() {
    document.addEventListener("keydown", this.onkeypress, false);

    this.callStatsApi()
      .then(res => this.setState({
        gumption: res.gumption,
        resilience: res.resilience
      }))
      .catch(err => console.log(err));

      this.callMapApi()
        .then(res => this.setState({
          mapCoordsX: res.coords.x,
          mapCoordsY: res.coords.y,
          map: res.map
        }))
  }

  callMapApi = async () => {
    const mapResponse = await fetch('/api/map');
    const map = await mapResponse.json();

    if (mapResponse.status !== 200) throw Error(map.message)

    return map;
  }

  callStatsApi = async () => {
    const statsResponse = await fetch('/api/stats');
    const stats = await statsResponse.json();

    if (statsResponse.status !== 200) throw Error(stats.message);

    return stats;
  };

  onkeypress = (event) => {
    let drawValue = this.state.mode === 'W' ? 1 : 0;

    if (event.code === 'ArrowUp') {
      if (this.state.mode !== 'E') {
        this.modDirection(drawValue, this.state.makerX, this.state.makerY, this.modNorth);
        this.modDirection(drawValue, this.state.makerX, this.state.makerY - 1, this.modSouth);
      }

      this.setState({
        makerY: this.state.makerY - 1
      })
    }
    else if(event.code === 'ArrowRight') {
      if (this.state.mode !== 'E') {
        this.modDirection(drawValue, this.state.makerX, this.state.makerY, this.modEast);
        this.modDirection(drawValue, this.state.makerX + 1, this.state.makerY, this.modWest);
      }

      this.setState({
        makerX: this.state.makerX + 1
      })
    }
    else if(event.code === 'ArrowDown') {
      if (this.state.mode !== 'E') {
        this.modDirection(drawValue, this.state.makerX, this.state.makerY, this.modSouth);
        this.modDirection(drawValue, this.state.makerX, this.state.makerY + 1, this.modNorth);
      }

      this.setState({
        makerY: this.state.makerY + 1
      })
    }
    else if(event.code === 'ArrowLeft') {
      if (this.state.mode !== 'E') {
        this.modDirection(drawValue, this.state.makerX, this.state.makerY, this.modWest);
        this.modDirection(drawValue, this.state.makerX - 1, this.state.makerY, this.modEast);
      }

      this.setState({
        makerX: this.state.makerX - 1
      })
    }
    else if (event.code === 'KeyW') {
      this.setState({
        mode: 'W'
      });
    } else if (event.code === 'KeyE') {
      this.setState({
        mode: 'E'
      });
    } else if (event.code === 'KeyR') {
      this.setState({
        mode: 'R'
      });
    }
  }

  modDirection = (value, x, y, calcFunction) => {
    this.setState({
      map: this.state.map.map((r, yIndex) => {
        return r.map((c, xIndex) => {
          if (x === xIndex && y === yIndex) {
            let binValue = intToBinary[c];
            binValue = calcFunction(binValue, value)
            return binaryToInt[binValue];
          }
          else {
            return c;
          }
        })
      })
    })
  }

  modNorth = (binValue, value) => {
    return value + binValue[1] + binValue[2] + binValue[3];
  }

  modEast = (binValue, value) => {
    return binValue[0] + value + binValue[2] + binValue[3];
  }

  modSouth = (binValue, value) => {
    return binValue[0] + binValue[1] + value + binValue[3];
  }

  modWest = (binValue, value) => {
    return binValue[0] + binValue[1] + binValue[2] + value;
  }

  saveMap = () => {
    fetch('/api/map', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        map: this.state.map,
        fileName: this.state.mapName
      }),
  });
  }

  handleFileNameChange = (event) => {
    this.setState({
      mapName: event.target.value
    })
  }

  handleLoadMapName = (event) => {
    this.setState({
      loadMapName: event.target.value
    })
  }

  loadMap = async () => {
    if (this.state.showLoadMapText) {
      const mapName = this.state.loadMapName;
      const mapResponse = await fetch('/api/map?mapName=' + mapName);;
      const res = await mapResponse.json();

      this.setState({
        showLoadMapText: false,
        mapCoordsX: res.coords.x,
        mapCoordsY: res.coords.y,
        map: res.map
      })

      return false;
    } else {
      this.setState({
        showLoadMapText: true
      });
    }
  }

  render() {
    let rows = [];

    if (this.state.map) {
      this.state.map.forEach(r => {
        let cols = [];
        r.forEach(c => {
          cols.push(<img src={intToImage[c]} />)
        })
        rows.push(<div style={{height: '15px'}}>{cols}</div>)
      });
    }

    return (
      <div className="App" onKeyPress={this.onkeypress}>
        <p className="App-intro">
          Gumption: {this.state.gumption} <br />
          Resilience: {this.state.resilience}
        </p>
        <div>
          Press 'W' to write lines, 'R' to remove, and 'E' to exist without modifying
        </div>
        <div style={{position: 'relative', width:"450px"}}>
          {rows}
          <img src={red_dot} style={{position:'absolute', top: (this.state.makerY * 15) + 6, left: (this.state.makerX * 15) + 6}} />
        </div>
        <div>
          Map Name: <input type="text" value={this.state.mapName} onChange={this.handleFileNameChange} />
        </div>
        <button onClick={this.saveMap}>Save Map</button>&nbsp;<button onClick={this.loadMap}>Load Map</button>
        {this.state.showLoadMapText && (<div>
          Load Map: <input type="text" value={this.state.loadMapName} onChange={this.handleLoadMapName} />
        </div>)}
      </div>
    );
  }
}

export default App;
