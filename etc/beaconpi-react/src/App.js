import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Navbar, Nav, NavItem} from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Beaconpi
            </Navbar.Brand>
          </Navbar.Header>
          <NavItem eventKey={1} href="#">
            Login
          </NavItem>
        </Navbar>

      </div>
    );
  }
}

export default App;
