import React, { Component } from 'react';
import { Client, SearchParams } from 'elasticsearch'
import renderHTML from 'react-render-html';

import logo from './logo.svg';
import './App.css';
import { Layout, Input, Select, Button,Card } from "element-react"
interface appState {
  value: string
  client: Client
  elasticIsRunning: boolean;
  querryRes: any[]


}
interface doc{
  title:String
}
class App extends Component<any, appState>{

  constructor(props: any) {
    super(props);

    this.state = {
      value: "",
      client: new Client({
        host: '0.0.0.0:9200',
        log: 'trace'
      }),
      querryRes: []
      ,

      elasticIsRunning: false
    }

    this.state.client.ping({
      requestTimeout: 1000
    }, (error) => {
      if (error) {
        this.setState({ elasticIsRunning: false });
      } else {
        this.setState({ elasticIsRunning: true });
      }
    });
    this.query = this.query.bind(this)

  }




  async query() {
    this.setState({ querryRes: [] })
    try {
      const response = await this.state.client.search({
        q: this.state.value,
        body: {
          "highlight": {
            "fields": {
              "attachment.content": {}
            }
          }
        }


      });
      if (response.hits.hits.length > 0) {
        const res: any[] = response.hits.hits.map((hit) => {
          let title=hit._source as doc;
          return {highlight:hit.highlight,title:title.title||"untitled"}
        })

        let tempArr: any[] = []


        tempArr = res.map((att) => { return {content:att.highlight["attachment.content"][0] ,title:att.title}})

this.setState({ querryRes: tempArr })

      }
    }
    catch (error) {
      console.trace(error.message)
    }

  }
  onChange(value: any) {
    this.setState({ value: value })
  }


  createCards = () => {
    let cards: any[] = []

    this.state.querryRes.forEach((element, index) => {

      cards.push(
        <Layout.Row key={'reskey' + index}>
          <Layout.Col span="24"><div >
          
          <Card
      className="box-card"
      header={
        <div className="clearfix">
          <span style={{ "lineHeight": "36px" }}>{element.title}</span>
        </div>
      }
    >
      <div className="text item"> {renderHTML(element.content)}</div>
     
    </Card>
          
          
         </div></Layout.Col>
        </Layout.Row>)


    })

    return cards;
  }



  render() {
    return (
      <div className="App">
        <Layout.Row>
          <Layout.Col span="24"><div>


          </div></Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24"><div >
            <Input size="large" placeholder="Please input" onChange={this.onChange.bind(this)} append={<Button type="primary" icon="search" onClick={this.query}>Search</Button>} />
          </div></Layout.Col>
        </Layout.Row>
        {this.createCards()}

      </div>
    );
  }
}

export default App;
