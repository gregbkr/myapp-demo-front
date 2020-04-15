import React from "react"

const Vars = () => (
    <div>
      <h3>Variables</h3>
      <ul>
        <li>GATSBY_DOTENVVAR from <code>.env.develop</code> file: <b>{process.env.GATSBY_DOTENVVAR}</b><br/></li>
        <li>GATSBY_API_URL from SSM codebuild: <b>{process.env.GATSBY_API_URL}</b><br/></li>
        <li>GATSBY_API_KEY from SSM-KMS codebuild: <b>{process.env.GATSBY_API_KEY}</b><br/></li>
      </ul>
    </div>
)

export default Vars
