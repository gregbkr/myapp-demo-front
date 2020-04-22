import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import ApiData from "../components/apidata"
import Vars from "../components/vars"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Some AWS Devops functions</h1>
    <p>This page is using aws infrastructure to demo popular services (v0.2)</p>
    {/* <p>Now go build something great.</p> */}
    <ApiData/>
    <Vars/>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
