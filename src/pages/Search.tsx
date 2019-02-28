import React from "react";
import { Layout, Input, Select, Button, Card } from "element-react"
import { Route } from 'react-router';
import { Client, SearchParams } from 'elasticsearch'
import renderHTML from 'react-render-html';

interface appState {
  value: string
  client: Client
  elasticIsRunning: boolean;
  querryRes: any[]
}
interface doc {
  title: String
}
class Search extends React.Component<any, appState> {
  constructor(props: any) {
    super(props);

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
            "fragment_size": 1000,
            "fields": {
              "attachment.content": {}
            }
          }
        }


      });
      if (response.hits.hits.length > 0) {
        let res: any[] = response.hits.hits.map((hit) => {
          let title = hit._source as doc;
          return { highlight: hit.highlight, title: title.title || "untitled" }
        })

        let tempArr: any[] = []
        tempArr = res.filter((att) => {
          return !("undefined" === typeof (att["highlight"]));
        }).map((att) => {
          return { content: "<pre>" + att.highlight["attachment.content"][0] + "</pre>", title: att.title }
        })
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
      <div>
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

export default Search;