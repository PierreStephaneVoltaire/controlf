import React, { Component } from 'react';
import { Client, SearchParams } from 'elasticsearch'
import logo from './logo.svg';
import './App.css';
import { Layout, Input, Select, Button, Card, Menu } from "element-react"
import { Route } from 'react-router';
import Search from './pages/Search';
import Uploadc from './pages/uplaod';
import { Link } from 'react-router-dom';

class App extends Component<any, any>{
  constructor(props: any) {
    super(props)
    this.state = {
      value: "",
      client: new Client({
        host: '0.0.0.0:9200',
      }),
      querryRes: []
      ,

      elasticIsRunning: false
    }

    this.state.client.ping({
      requestTimeout: 1000
    }, (error: any) => {
      if (error) {
        this.setState({ elasticIsRunning: false });
      } else {
        this.setState({ elasticIsRunning: true });
      }
    });

  }
  onSelect() {

  }

  render() {
    return (
      <div className="App">
        <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={this.onSelect.bind(this)}>
          <Menu.Item index="1" ><Link to='/'>Control F</Link></Menu.Item>
          <Menu.Item index="3"><Link to='/upload'>Upload</Link></Menu.Item>
          <Menu.Item index="3"><Link to='/about'>About</Link></Menu.Item>
        </Menu>
        <Layout.Row>
          <Layout.Col span="24"><div>
            <Route exact path="/" component={Search} />
            <Route
              path='/upload'
              render={(props) => <Uploadc client={this.state.client} />}
            />
          </div></Layout.Col>
        </Layout.Row>


      </div>
    );
  }
}

export default App;
