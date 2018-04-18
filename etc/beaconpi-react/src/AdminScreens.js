import React, { Component } from 'react';
import * as cfg from './config.js';
import { FieldGroup } from './FormUtils.js';

import { Row, Col, Button, Checkbox, FormGroup, ControlLabel, FormControl
  } from 'react-bootstrap';

class AdminUserAdd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: "",
      email: "",
      password: "",
      dn: "",
      active: false,
      submitted: false,
    };
    this.handleChangeEmail = (e) => this.setState({email: e.target.value});
    this.handleChangePassword = (e) => this.setState({password: e.target.value});
    this.handleChangeDN = (e) => this.setState({dn: e.target.value});
    this.handleChangeActive = (e) => this.setState({active: e.target.value});
    this.doSubmit = this.doSubmit.bind(this);
  }

  doSubmit(e) {

  }

  render() {
    return (
      <Row>
        <Col sm={12} md={6}>
          <form>
            <FieldGroup
              id="formControlDisplayName" type="text"
              label="Display Name" placeholder="Enter display name"
              value={this.state.dn}
              onChange={this.handleChangeDN}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlEmail" type="email"
              label="Email address" placeholder="Enter email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlPassword" type="password"
              label="Passphrase" placeholder="Enter passphrase"
              value={this.state.password}
              onChange={this.handleChangePassword}
              disabled={this.state.submitted}
            />
            <Checkbox title="Active title" checked={this.state.active} 
                onChange={(e) => this.setState({active: e.target.checked})} 
                disabled={this.state.submitted}>Active</Checkbox>
            <Button type="submit" bsStyle="success" onChange={this.doSubmit} 
                disabled={this.state.submitted}>Add User</Button>
            </form>
          </Col>
        </Row>
      );
    }
  }

class AdminUserMod extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      userlist: [{"Id": 1, "Label": "placeholder..."}],
      error: "",
      email: "",
      password: "",
      dn: "",
      active: false,
      submitted: false,
    };
    this.handleChangeEmail = (e) => this.setState({email: e.target.value});
    this.handleChangePassword = (e) => this.setState({password: e.target.value});
    this.handleChangeDN = (e) => this.setState({dn: e.target.value});
    this.handleChangeActive = (e) => this.setState({active: e.target.value});
    this.doSubmit = this.doSubmit.bind(this);
    this.doDelete = this.doDelete.bind(this);
  }

  doSubmit(e) {

  }
  doDelete(e) {

  }

  render() {
    var userEles = this.state.userlist.map((v) => {
      return (<option value={v.Id}>{v.Label}</option>);
    });
    return (
      <Row>
        <Col sm={12} md={6}>
          <form>
            <FormGroup controlId="formSelectUser">
              <FormControl componentClass="select" placeholder="select">
                {userEles}
              </FormControl>
            </FormGroup>
          </form>
          <form>
            <FieldGroup
              id="formControlDisplayName" type="text"
              label="Display Name" placeholder="Enter display name"
              value={this.state.dn}
              onChange={this.handleChangeDN}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlEmail" type="email"
              label="Email address" placeholder="Enter email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlPassword" type="password"
              label="Passphrase" placeholder="Enter passphrase"
              value={this.state.password}
              onChange={this.handleChangePassword}
              disabled={this.state.submitted}
            />
            <Checkbox title="Active title" checked={this.state.active} onChange={(e) => this.setState({active: e.target.checked})}>
              Active
            </Checkbox>
            <Button type="submit" bsStyle="success" onChange={this.doSubmit}>Mod User</Button>
            {' '}
            <Button type="button" bsStyle="danger" onChange={this.doDelete}>Delete User</Button>
          </form>
        </Col>
      </Row>
    );
  }
}

class AdminModBeacon extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      beaconlist: [{"Id": 1, "Label": "placeholder..."}],
      error: "",
      label: "",
      uuid: "",
      major: "",
      minor: "",
      submitted: false,
    };

    this.handleChangeLabel = (e) => this.setState({label: e.target.value});
    this.handleChangeUuid = (e) => this.setState({uuid: e.target.value});
    this.handleChangeMajor = (e) => this.setState({major: e.target.value});
    this.handleChangeMinor = (e) => this.setState({minor: e.target.value});
    this.doSubmit = this.doSubmit.bind(this);
    this.doNew = this.doNew.bind(this);
    this.doDelete = this.doDelete.bind(this);
  }

  doSubmit(e) {

  }
  doNew(e) {

  }
  doDelete(e) {

  }

  render() {
    var beaconEles = this.state.beaconlist.map((v) => {
      return (<option value={v.Id}>{v.Label}</option>);
    });
    return (
      <Row>
        <Col sm={12} md={6}>
          <form>
            <FormGroup controlId="formSelectUser">
              <FormControl componentClass="select" placeholder="select">
                {beaconEles}
              </FormControl>
            </FormGroup>
          </form>
          <form>
            <FieldGroup
              id="formControlLabel" type="text"
              label="Display Name" placeholder="Enter Label"
              value={this.state.label}
              onChange={this.handleChangeLabel}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlUuid" type="text"
              label="Uuid" placeholder="Enter Uuid (hex)"
              value={this.state.uuid}
              onChange={this.handleChangeUuid}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlMajor" type="number"
              label="Major" placeholder="Enter Major"
              value={this.state.major}
              onChange={this.handleChangeMajor}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlMinor" type="number"
              label="Minor" placeholder="Enter Minor"
              value={this.state.minor}
              onChange={this.handleChangeMinor}
              disabled={this.state.submitted}
            />

            <Button type="button" bsStyle="success" onChange={this.doNew}>New Beacon</Button>
            {' '}
            <Button type="submit" onChange={this.doSubmit}>Mod Beacon</Button>
            {' '}
            <Button type="button" bsStyle="danger" onChange={this.doDelete}>Delete Beacon</Button>
          </form>
        </Col>
      </Row>
    );
  }
}

class AdminModEdge extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      edgeList: [{"Id": 1, "Label": "placeholder..."}],
      error: "",
      uuid: "",
      title: "",
      room: "",
      locationVal: "",
      description: "",
      model: -1,
      submitted: false,
    };

    this.handleChangeUuid = (e) => this.setState({uuid: e.target.value});
    this.handleChangeTitle = (e) => this.setState({title: e.target.value});
    this.handleChangeRoom = (e) => this.setState({room: e.target.value});
    this.handleChangeLocation = (e) => this.setState({locationVal: e.target.value});
    this.handleChangeDescription = (e) => this.setState({description: e.target.value});
    this.handleChangeModel = (e) => this.setState({model: e.target.value});

    this.doSubmit = this.doSubmit.bind(this);
    this.doSubmit = this.doNew.bind(this);
    this.doDelete = this.doDelete.bind(this);
  }

  doSubmit(e) {

  }
  doNew(e) {

  }
  doDelete(e) {

  }

  render() {
    var edgeEles = this.state.edgeList.map((v) => {
      return (<option value={v.Id}>{v.Label}</option>);
    });
    return (
      <Row>
        <Col sm={12} md={6}>
          <form>
            <FormGroup controlId="formSelectUser">
              <FormControl componentClass="select" placeholder="select">
                {edgeEles}
              </FormControl>
            </FormGroup>
          </form>
          <form>
            <FieldGroup
              id="formControlUuid" type="text"
              label="Uuid" placeholder="Enter Uuid (hex)"
              value={this.state.uuid}
              onChange={this.handleChangeUuid}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlTitle" type="text"
              label="Title" placeholder="Enter Title"
              value={this.state.title}
              onChange={this.handleChangeTitle}
              disabled={this.state.submitted}
            />
            <FieldGroup
              id="formControlRoom" type="text"
              label="Room" placeholder="Enter Room"
              value={this.state.room}
              onChange={this.handleChangeRoom}
              disabled={this.state.submitted}
            />
            <FormGroup controlId="formControlLocation">
              <ControlLabel>Location</ControlLabel>
              <FormControl componentClass="textarea" placeholder="Enter Location"
              value={this.state.locationVal}
              onChange={this.handleChangeLocation}
              disabled={this.state.submitted}/>
            </FormGroup>
            <FormGroup controlId="formControlDescription">
              <ControlLabel>Description</ControlLabel>
              <FormControl componentClass="textarea" placeholder="Enter Description"
              value={this.state.description}
              onChange={this.handleChangeDescription}
              disabled={this.state.submitted}/>
            </FormGroup>
            <FormGroup controlId="formControlsModel">
              <ControlLabel>Model</ControlLabel>
              // TODO(brad) onChange, value
              <FormControl componentClass="select" placeholder="select"
              value={this.state.model}
              onChange={this.handleChangeModel}
              disabled={this.state.submitted}
              >
                <option value="select">select</option>
              </FormControl>
            </FormGroup>

            <Button type="button" bsStyle="success" onChange={this.doNew}>New Edge</Button>
            {' '}
            <Button type="submit" onChange={this.doSubmit}>Mod Edge</Button>
            {' '}
            <Button type="button" bsStyle="danger" onChange={this.doDelete}>Delete Edge</Button>
          </form>
        </Col>
      </Row>
    );
  }
}

export { AdminUserAdd, AdminUserMod, AdminModBeacon, AdminModEdge };
