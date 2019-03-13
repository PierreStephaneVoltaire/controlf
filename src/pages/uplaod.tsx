import React from "react";
import { Layout, Input, Select, Button, Card, Upload } from "element-react"
import { Route } from 'react-router';
import { Client, SearchParams } from 'elasticsearch'
import renderHTML from 'react-render-html';
import FileBase64 from 'react-file-base64';
import { string } from "prop-types";

interface UploadcState {
  client: Client,
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
      client: this.props.client,
    }
    this.addToEs = this.addToEs.bind(this)
  }
  addToEs() {
    let el: any = document.getElementsByClassName("myfile")[0].children[0];
    let reader = new FileReader();
    reader.readAsDataURL(el.files[0]);
    reader.onload = async () => {
      let data: string = reader.result as string;
      await this.state.client.index(
        {
          index: "simple_search",
          type: "doc",
          pipeline: "attachment",
          body: {
            data: data.replace(/data:.+?,/, "")
          }
        }
      ).then((r) => {
        console.log(r)
      }).catch((e) => {
        console.log(e)
      })
    }
  }
  render() {
    return (
      <Layout.Row>
        <Layout.Col span="24"><div>
          <Input className="myfile" type="file"
            placeholder="Please input" />
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

