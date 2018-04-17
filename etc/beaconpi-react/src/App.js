import React, { Component } from 'react';
import './App.css';
import './bootstrap/css/bootstrap.min.css';
import './bootstrap/css/bootstrap-theme.min.css';
import { decorate, observable } from "mobx";
import { observer } from "mobx-react";
import * as cfg from "./config.js";

import { Grid, Row, Col, Navbar, Nav, NavItem, FormGroup,
  ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class Home extends Component {
  //constructor(props, context) {
  //  super(props, context);
  //}

  render() {
    return (
      <Row>
        <Col md={4}>
          Welcome home
        </Col>
      </Row>
    )
  }
}

class LoginData {
  //TODO(brad) is this safe?
  id = Math.random();
  loggedin = false;
  displayName = "";
  email = "";
}
decorate(LoginData, {
  loggedin: observable,
  displayName: observable,
  email: observable
})

var Login = observer(
class Login extends Component {
  
  constructor(props, context) {
    super(props, context);

    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      valueEmail: '',
      valuePassword: '',
      submitted: false,
      errortext: false
    };
  }

  handleChangeEmail(e) {
    this.setState({ valueEmail: e.target.value });
  }
  handleChangePassword(e) {
    this.setState({ valuePassword: e.target.value });
  }
  handleSubmit(e) {
    this.setState({submitted: true});
    var that = this;
    fetch(cfg.app + "/auth/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "Email": this.state.valueEmail,
        "Passphrase": this.state.valuePassword
      }),
    }).then((r) => r.json())
    .then((rj) => {
      if ('Error' in rj) {
        that.setState({
          errortext: rj.Error
        });
      }
      if ('Success' in rj) {
        that.props.loginData.displayName = rj.DisplayName;
        that.props.loginData.email = that.state.valueEmail;
        that.props.loginData.loggedin = true;
      }
      that.setState({
        valuePassword: '',
        submitted: false
      });
    })
    .catch((error) => {
      that.setState({
        valuePassword: '',
        submitted: false,
        errortext: "Error receiving confirmation from server"
      });
    });
  }

  render() {
    if (this.props.loginData.loggedin) {
      return (
        <h3> You are logged in </h3>
      )
    } else {
      var enableSubmit = this.state.valueEmail.length > 2 && 
        this.state.valuePassword.length > 6;
      return (
        <Col xs={12} sm={6}>
          <form>
            <FieldGroup
              id="formControlEmail" type="email"
              label="Email address" placeholder="Enter email"
              onChange={this.handleChangeEmail}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlPassphrase" type="password"
              label="Passphrase" placeholder="Enter Passphrase"
              onChange={this.handleChangePassword}
              disabled={this.state.submitted}
            />
            <Button bsStyle="success" 
              disabled={!enableSubmit || this.state.submitted}
              onClick={this.handleSubmit}
            >{this.state.submitted ? "Checking" : "Login"}</Button>
          </form>
        </Col>
      )
    }
  }
})

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      view: "login"
    };
  }
  render() {
    var view;
    if (this.state.view === "login") {
      view = <Login loginData={loginData} />
    } else if (this.state.view === "home") {
      view = <Home loginData={loginData} />
    }


    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Beaconpi
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#Login">Login</NavItem>
          </Nav>
        </Navbar>
        <Grid>
          {view}
        </Grid>
      </div>
    );
  }
}

var loginData = new LoginData();

export default App;
