var Fili = require('fili');
var dateFormat = require('dateformat');
var Chart = require('chart.js');

// var targeturl = 'EnterMetricsServerHere';
var targeturl = 'http://3508data.soe.uoguelph.ca:32967';

var dps = [];
var dbl = [];
var chart;
const colorsunder = [
  'rgba(255, 99, 132, 0.05)',
  'rgba(99, 255, 132, 0.05)',
  'rgba(99, 132, 225, 0.05)',
  'rgba(0, 99, 132, 0.05)',
  'rgba(255, 0, 132, 0.05)',
];
const colorson = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(99, 255, 132, 0.8)',
  'rgba(99, 132, 225, 0.8)',
  'rgba(0, 99, 132, 0.8)',
  'rgba(255, 0, 132, 0.8)',
];
function enableCharts(elements) {
  var datasets = [];
  dps = [];
  dbl = [];
  for (var i = 0; i < elements; i++) {
    dps.push([]);
    datasets.push({
      label: 'Distance Edge ' + reverseedgeindexmap[i] + ' (m)',
      data: dps[i],
      backgroundColor: colorsunder[i],
      borderColor: colorson[i]
    });
  }
  var chartt = new Chart(document.getElementById('chart1'),
    {
      type: 'line',
      data: {
        datasets: datasets,
        labels: dbl
      },
      options: {
        responsive: false,
        title: { text: 'Edge Node to beacon distance', display: true },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: -0.5,
              suggestedMax: 8
            }
          }]
        }
      }
  });
  
  chart = chartt
}

function chartsUpdateDistances(data, edges, bracket, inputmap, maxlen) {
  for (var i in data) {
    var cur = data[i];
    var dataset = dps[inputmap[edges[i]]];
    dataset.push(cur);
    // Push the current date once
    if (i == 0) {
      dbl.push(bracket);
    }

    if (dataset.length > maxlen) {
      dataset.shift();
    }
    if (dbl.length > maxlen) {
      dbl.shift();
    }
  }
  chart.update()
}

// Mouse target
var target = null;
function Circle(cx, cy, r, moveable, i) {
  moveable == moveable || false;

  var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  circle.style.fill = colorson[i];
  circle.owner = this;
  this.element = circle;
  this.x = cx;
  this.y = cy;
  if (moveable) {
    this.element.addEventListener("mousedown", function(event) {
      target = event.target;
    });
  }
}

Circle.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  this.element.setAttribute('cx', x);
  this.element.setAttribute('cy', y);
}
Circle.prototype.addToSVG = function(id) {
  var svgwin = document.getElementById(id);
  svgwin.appendChild(this.element);
  return true
}

function setupSVGClick(svgele) {
  var svg = document.getElementById(svgele);
  svg.addEventListener('mousemove', function(event) {
    if (target == null) {
      return;
    }
    target.owner.move(event.offsetX, event.offsetY);
  });
  svg.addEventListener('mouseup', function(event) {
    if (target == null) {
      return;
    }
    target.owner.move(event.offsetX, event.offsetY);
    target = null
  });
}

function makeLine(svg, x1, y1, x2, y2) {
  var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  line.setAttribute('y1', y1);
  line.setAttribute('y2', y2);
  line.setAttribute('x1', x1);
  line.setAttribute('x2', x2);
  line.setAttribute('stroke-width', 2);
  line.setAttribute('stroke', 'grey');
  svg.appendChild(line);
}

function drawLinesSVG(svgele, pixels, todist, units) {
  var svg = document.getElementById(svgele);
  var rect = svg.getBoundingClientRect();
  var width = rect.width;
  var height = rect.height;
  // Vertical
  for (var w = pixels; w < width; w += pixels) {
    makeLine(svg, w, 0, w, height);
  }
  for (var h = pixels; h < height; h += pixels) {
    makeLine(svg, 0, h, width, h);
  }

}

function getCenterAndMove(beacon, circlenumber) {
  circleloc[circlenumber].move(beacon.Loc[0], beacon.Loc[1]);
};

var circleloc;
var edges = [];

// Setup for filters
var filters = [];
function setupFilters(count) {
  filters = [];
  var iirCalculator = new Fili.CalcCascades();
  var coefficients = iirCalculator.lowpass({
        order: 4,
        characteristic: 'butterworth',
        Fs: 1,
        Fc: 0.1,
        gain: 0,
        preGain: false
  });
  for (var i = 0; i < count; i++) {
    filters.push(new Fili.IirFilter(coefficients));
  }
}

function filterDistances(distances) {
  for (var i in distances) {
    distances[i]= filters[i].singleStep(distances[i]);
  }
  return distances
}

function updateLocationsTrilat(block) {
  getCenterAndMove(block, beacon);
  //console.log(block);
}

function averageDistances(filtered) {
  var result = {};
  var count = {};
  for (var i in filtered) {
    if (!result[filtered[i].Edge]) {
      result[filtered[i].Edge] = 0;
      count[filtered[i].Edge] = 0;
    }
    result[filtered[i].Edge] += filtered[i].distance;
    count[filtered[i].Edge] += 1;
  }
  var keys = Object.keys(result);
  for (var key in keys) {
    result[keys[key]] /= count[keys[key]];
  }
  return result
}

// Cursors and blocks track cursors and blocks for each beacon
var cursors = [];
var blocks = [];
var timeoutids = [];

function resetCursors() {
  var nbeacons = beaconid.length;
  cursors = Array(nbeacons);
  cursors = cursors.map((a) => 0);
  blocks = Array(nbeacons);
  blocks = blocks.map((a) => []);
  timeoutids = Array(nbeacons);
  timeoutids = timeoutids.map((a) => -1);
}

var TIMEOUT = 5000;

function processData(data, beacon) {
  // On fetch
  if (data) {
    var helddata = data;
    beacon = helddata[0].Beacon;
    cursors[beacon] = 0;
    var second = helddata.map((o) => {
      var date = new Date(o.Bracket);
      return date.getSeconds();
    })
    var cursec = second[0];
    var block = 0;
    blocks[beacon].push([]);
    for (var i in second) {
      if (second[i] != cursec) {
        block++;
        blocks[beacon].push([]);
        cursec = second[i];
      }
      blocks[beacon][block] = helddata[i]
    }
  }

//  if (cursor[beacon] >= blocks[beacon].length) {
//    timeoutid = setTimeout(processData, 0);
//    return;
//  }
  if (justupdated) {
    justupdated = false;
    timeoutids[beacon] = setTimeout(startLoop, 0);
    return;
  }  

  // Chart update
  // Update location with current block
  
  // Fix scaling first
  var i = cursors[beacon];
  blocks[beacon][i].Loc = blocks[beacon][i].Loc.map(l => l * scale);
  updateLocationsTrilat(blocks[beacon][i]);

  var distances = blocks[beacon][i].Distance;
  var filtereddistances = filterDistances(distances.slice());

  // NOTE: We only display time series data for the first beacon
  if (beaconidtoindex[beacon] == 0) {
    chartsUpdateDistances(dofilter ? filtereddistances : distances,
                          blocks[beacon][i].Edge, blocks[beacon][i].Bracket,
                          edgeindexmap, 25);
  }

  cursors[beacon]++;
  if (cursors[beacon] >= blocks[beacon].length) {
    // This should work
    timeoutids[beacon] = setTimeout(startLoop, TIMEOUT);
    return;
  }

  timeoutids[beacon] = setTimeout(processData, TIMEOUT, undefined, beacon);

}

function filterswitch(event) {
  dofilter = event.target.checked;
}

function submitForm(event) {
  var edgeselement = document.getElementById('edges');
  var beaconelement = document.getElementById('beacon');
  var tb = eval(beaconelement.value);
  var te = eval(edgeselement.value);
  addEdges(te);
  beaconid = tb;
  for (var i in timeoutids) {
    window.clearTimeout(timeoutids[i])
  }
  startLoop()
}

function reverseMap(map) {
  var keys = Object.keys(map);
  var output = {}
  for (var i in keys) {
    var keyval = keys[i];
    output[map[keyval]] = keyval;
  }
  return output;
}

var edgeindexmap = {};
var reverseedgeindexmap = {};
var edges = [];
var edgenums = [];
var beaconid = [1];
var dofilter = true;
// First doesn't count
var justupdated = true;
// Scale is the number of pixels to the metre
var scale = 50.0; 

function startLoop() {
  var dnow = new Date();
  // Scaling Factor (px per meter)
  var edgelocs = edges.map(e => {return [e.x / scale, e.y / scale, 0]})
  for (var i in beaconid) {
    var bodyobj = {
      "Edges": edgenums, 
      "Beacon": beaconid[i],
      "EdgeLocations": edgelocs,
      "Since": dateFormat(new Date(dnow - TIMEOUT*2), 'isoUtcDateTime'),
      "Before": dateFormat(new Date(dnow - TIMEOUT), 'isoUtcDateTime'),
      "Filter": "average",
      "BracketSeconds": 5
    };
    fetch(targeturl + '/history/trilateration', {
      method: "POST",
      body: JSON.stringify(bodyobj)
    }).then(function(res) {
      return res.json();
    }).then(function(data) {
      processData(data);
    });
  }
}


function addEdges(lEdgenums) {
  justupdated = !justupdated;
  edgeindexmap = {};
  var svgroot = document.getElementById('svgwin');
  edges.forEach((e) => {
    svgroot.removeChild(e.element);
  });
  edges = [];
  edgenums = lEdgenums;
  for (var i in lEdgenums) {
    edges.push(new Circle(Math.random()*360+20, Math.random()*360+20,
          30, true, i));
    edges[i].addToSVG('svgwin');
    edgeindexmap[lEdgenums[i]] = i;
  }
  reverseedgeindexmap = reverseMap(edgeindexmap);
  enableCharts(edges.length);
  setupFilters(edges.length);
}
var beaconidtoindex = {};
function addBeacons(beacons) {
  //TODO(brad) remove old circles
  circleloc = [];
  for (var i in beacons) {
    beaconidtoindex[beacons[i]] = i;
    circleloc[i] = new Circle(200, 200+50*i, 15);
    circleloc[i].element.setAttribute('class', 'circle-slide');
    circleloc[i].addToSVG('svgwin');
  }
}

function startup() {
  drawLinesSVG('svgwin', scale, 1, 'm');
  addEdges([1, 2, 3]);
  beaconid = [1];
  addBeacons(beaconid);
  resetCursors();
  setupSVGClick('svgwin');
  document.getElementById('filtercheckbox').addEventListener('change', filterswitch);
  document.getElementById('submit').addEventListener('click', submitForm);
  // Chart update
  startLoop();
}

window.onload = startup;

export {getCenterAndMove, Circle, startLoop}
