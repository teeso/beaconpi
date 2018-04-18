import Chart from 'chart.js';
import dateFormat from 'dateformat';
import Fili from 'fili';
import React, { Component } from 'react';
import * as cfg from './config.js';

class Plot extends Component {
//  constructor(props, context) {
//    super(props, context);
//  }

  render() {
    return <BeaconSeriesChart/>;
  }
}

class BeaconSeriesChart extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: false,
      data: [],
      datalabel: [],

      edges: [],
      beacon: [],
      since: null,
      before: null,

      chart: null,
      filter: null,
      distance: false,
      historysec: 2,
    }
  }

  getData() {
    var before = new Date();
    before.setSeconds(before.getSeconds() - this.state.historysec);
    var after = new Date()
    after.setSeconds(after.getSeconds() - this.state.historysec - 1);
    before = dateFormat(before, 'isoUtcDateTime');
    after = dateFormat(after, 'isoUtcDateTime');

    var that = this;
    fetch(cfg.app + "/history/short", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        Edges: [1],
        Beacon: 1,
        Since: after,
        Before: before,
      }),
    }).then((r) => r.json())
    .then((rj) => {
      //TODO(brad) implement this
      console.log(rj);
      that.setState({
      });
    })
    .catch((error) => {
      that.setState({
        error: "Error occured fetching data from server"
      });
    });
  }

  componentDidMount() {
    this.getData();
    this.container.style.width = "%100";
    this.container.style.height = "400px";
    this.container.width = this.container.offsetWidth;
    this.container.height = this.container.offsetHeight;
    //TODO(brad) can we make this reactive?

    this.chart = new Chart(this.container, {
      type: 'line',
      data: {
        datasets: this.state.data,
        labels: this.state.datalabel,
      },
      options: {
        responsive: false,
        title: { text: 'Edge Node to Beacon Distance', display: true },
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

  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return <canvas ref={(e) => this.container = e}></canvas>;
  }
}

export { Plot }
