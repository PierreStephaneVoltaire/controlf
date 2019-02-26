import React from "react";
import { Layout, Input, Select, Button, Card, Upload } from "element-react"
import { Route } from 'react-router';
import { Client, SearchParams } from 'elasticsearch'
import renderHTML from 'react-render-html';
import * as uid from "uid"
import { async } from "q";
import FileBase64 from 'react-file-base64';
var urlencode = require('urlencode');
import base64url from "base64url";

interface UploadcState {

  listOfFlies: any[]
  client: Client


}
interface UploadcProps {
  client: Client
}
interface doc {
  title: String
}

class Uploadc extends React.Component<UploadcProps, UploadcState> {
  constructor(props: any) {
    super(props);
    this.state = {
      listOfFlies: [],
      client: this.props.client
    }
    this.addToEs = this.addToEs.bind(this)

  }
  addToEs() {
    this.state.listOfFlies.forEach(async (file) => {
     const reg=/data:\w+;base64,/;
      await this.state.client.index(
        {
          index: "simple_search",
          type: "doc",
          id: uid(),
          pipeline: "attachment",

          body: {
            data:  base64url.fromBase64(file.base64).replace(reg,"")
            , title: file.name
          }
        }
      ).then((r) => {
        console.log(r)
      }).catch((e) => {
        console.log(e)
      })
    });

  }


  getFiles(files: any) {
    this.setState({ listOfFlies: files })
  }

  render() {
    return (
      <Layout.Row>
        <Layout.Col span="24"><div>
          <FileBase64
            multiple={true}
            onDone={this.getFiles.bind(this)} />
        </div>
        </Layout.Col>
        <Layout.Col span="24"><div>
          <Button onClick={this.addToEs}>Upload</Button>
        </div>
        </Layout.Col>

      </Layout.Row>
    )
  }

}

export default Uploadc;