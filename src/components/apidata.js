import React from "react"
// axios.get(GATSBY_API_URL, { headers: { 'x-api-key': '3oSJjiDKSu6I6FZslKbhz4UqDTiZ2OJi7L9Tn6NV' } })

class ApiData extends React.Component {

  constructor(props) {
    super(props);
    this.handleSum = this.handleSum.bind(this);
    this.handleCapital = this.handleCapital.bind(this);
  }

  state = {
    error: false,
    helloText: [],
    sumResult: [],
    capitalResult: []
  }
  
  componentDidMount() {
    var url = "https://" + process.env.GATSBY_API_URL + "hello"
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.GATSBY_API_KEY   
      }
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log(data.message)
        this.setState({ helloText: data.message })
      })
  }

  // curl -X POST -d '{"key1":2,"key2":3}' -H "content-type: application/json" https://41yz6noqw3.execute-api.eu-west-1.amazonaws.com/Prod/sum
  handleSum(event) {
    event.preventDefault()
    console.log(this.n1.value)

    var url = "https://" + process.env.GATSBY_API_URL + "sum"
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.GATSBY_API_KEY 
      },      
      body: JSON.stringify({ key1: this.n1.value, key2: this.n2.value })
    };
    
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.result)
        this.setState({ sumResult: data.result})
      })
  }

  handleCapital(event) {
    event.preventDefault()
    console.log(this.country.value)
    var url = "https://" + process.env.GATSBY_API_URL + "capital?country=" + this.country.value
    console.log(url)
    // const GATSBY_API_URL = "https://41yz6noqw3.execute-api.eu-west-1.amazonaws.com/Prod/capital"
    
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.GATSBY_API_KEY
      },
    };
    
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.capital)
        this.setState({ capitalResult: data.capital})
      })
  }

  render() {
    // const {helloText} = this.state
    return (
      <div id="lambda">
        <br></br>
        <h3>Lamdba via openAPI</h3>
        <ul>
          <li>Simple GET to /hello when page loads : <b>{this.state.helloText}</b></li>
          <li>Sum of two numbers:
            <form onSubmit={this.handleSum}>
              <input ref={(ref) => { this.n1 = ref }} placeholder="Num 1" type="number" name="n1" style={{ width: "60px" }} />
              &nbsp;+&nbsp;
              <input ref={(ref) => { this.n2 = ref }} placeholder="Num 2" type="number" name="n2" style={{ width: "60px" }} />&nbsp;
              <button type="Submit">Calculate</button>&nbsp;&nbsp;&nbsp;
              <b>{this.state.sumResult}</b>
            </form>
          </li>
          <li>Find the capital of france, england or spain:
            <form onSubmit={this.handleCapital}>
              <input ref={(ref) => { this.country = ref }} placeholder="france" type="text" name="country" style={{ width: "100px" }} />
              &nbsp;&nbsp;
              <button type="Submit">Find the capital</button>&nbsp;&nbsp;&nbsp;
              <b>{this.state.capitalResult}</b>
            </form>
          </li>
        </ul>
      </div>
    )
  }
}

export default ApiData
