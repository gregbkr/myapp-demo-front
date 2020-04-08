import React from "react"
import axios from "axios"

class ApiData extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    error: false,
    helloText: [],
    additionResult: []
  }
  componentDidMount() {
    const GATSBY_API_URL = "https://s1xkj1atd2.execute-api.eu-west-1.amazonaws.com/Prod/hello"
    //const GATSBY_API_KEY = "3oSJjiDKSu6I6FZslKbhz4UqDTiZ2OJi7L9Tn6NV"
    const GATSBY_API_KEY = "ikZ21B40WU9ssS7YVrgDw1bzVUPeMun53jYE2DVP"

    // axios.get(GATSBY_API_URL, { headers: { 'x-api-key': '3oSJjiDKSu6I6FZslKbhz4UqDTiZ2OJi7L9Tn6NV' } })
    fetch(GATSBY_API_URL, {
      method: 'GET',
      headers: {
        'x-api-key': GATSBY_API_KEY
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message)
        this.setState({ helloText: data.message })
      })
  }

  handleSubmit(event) {
    event.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: this.n1.value, n2: this.n2.value })
    };
    fetch('https://fuagh3hifi.execute-api.eu-west-1.amazonaws.com/dev/addition', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ additionResult: "Result is: " + data }))
  }

  render() {
    // const {helloText} = this.state
    return (
      <div id="lambda">
        <br></br>
        <h3>Lamdba via openAPI</h3>
        <ul>
          <li>Simple GET to /hello when page loads - Result: <b>{this.state.helloText}</b></li>
          <li>Returned data from button click:
            <form onSubmit={this.handleSubmit}>
              <input ref={(ref) => { this.n1 = ref }} placeholder="Number 1" type="text" name="n1" style={{ width: "60px" }} />
              &nbsp;+&nbsp;
              <input ref={(ref) => { this.n2 = ref }} placeholder="Number 2" type="text" name="n2" style={{ width: "60px" }} />&nbsp;
              <button type="Submit">Calculate sum</button>&nbsp;
              <b>{this.state.additionResult}</b>
            </form>
          </li>
          <li>Other?</li>
        </ul>
      </div>
    )
  }
}

export default ApiData
