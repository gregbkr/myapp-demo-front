# MyApp: a front in Gatsby, hosted in AWS S3

## Overview
This setup will deploy a ReactJs gatsby website, hosted on AWS S3.
Codebuild will push new commit to S3 for CI/CD.
This website will have function that connect to an API backend, deployed via this [code](https://github.com/gregbkr/myapp-serverless-api).

More info: you can find an overview of that setup on my [blog](https://greg.satoshi.tech/gatsby-s3)

### Infra
![Infra](./.github/images/myapp-front-infra.png)

- Front: Reactjs [Gatsby](https://www.gatsbyjs.org) with [Gatsby starter template](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-default/)
- Hosting: [S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html): to store your static files
- CDN: [cloudfront](https://aws.amazon.com/cloudfront)
- CI: Codebuild
- Deployment: [CloudFormation](https://aws.amazon.com/cloudformation) templates

### CI/CD flow diagram

![CI/CD](./.github/images/myapp-front-cicd.png)

A simple `git push` from a developer in Github will launch the whole CI/CD process. Codebuild will copy the change to S3 and changes will appear directly.

## Deploy

### Prerequisites
Please setup on your laptop:
- AWS cli, and AWS account to deploy in `eu-west-1`
- [Gatsby](https://www.gatsbyjs.org/)
- Github personal token with `admin:repo_hook, repo` rights from [here](https://github.com/settings/tokens)

### Test the front on your laptop
- Run local gatsby: `gatsby develop` 
- Browse http://127.0.0.1:8000

### Setup API backend
- Go to repo [myapp-serverless-api](https://github.com/gregbkr/myapp-serverless-api) and deploy it
- Retrieve the `api url` and `api key`

### Deploy front
- Create a certificate in route53 for the hosted zone of your choise e.g.: `*.cloudlabs.link`.
- If you don't have any hosted zone, comment resources `myDNSRecord:` and `myDistribution` in `cloudformation/main.yml`
- Create the infra (S3 bucket & Cloudfront & Codebuild) and deploy the code to S3:
```
cd cloudformation
export CF_DEMO_ENVIRONMENT=myapp-gatsby
export GITHUB_TOKEN=xxx

./deploy.sh \
    ${CF_DEMO_ENVIRONMENT} \
    [Api Url] \     <-- from API gateway
    [Api Key] \
    [GH Repo Url] \ <-- Github url so codebuild can monitor push
    [GH token] \    <-- Github personal token
    [DNS] \         <-- Name of the bucket, and Route53 alias
    [Hosted Zone] \ <-- Hosted DNS Zone for Route53, don't forget the last "."
    [Cert Arn]      <-- Arn of the certificate securing your domain

ex:
./deploy.sh \
    ${CF_DEMO_ENVIRONMENT} \
    ieddcaot8i.execute-api.eu-west-1.amazonaws.com/Prod/ \
    YetSxaQMZj7A4wLmV5Fd3aVQ3oXfilyL7dpV6k2m \
    https://github.com/gregbkr/myapp-gatsby-front \
    ${GITHUB_TOKEN} \
    gatsby.mymicrosaving.com \
    mymicrosaving.com. \
    arn:aws:acm:us-east-1:391378411314:certificate/be08f8a9-7c2e-404f-9fdb-159783313f57
```

### Check
- Access front from S3 url:
```
aws cloudformation \
   describe-stacks \
   --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
   --stack-name ${CF_DEMO_ENVIRONMENT}-front-infra
```
- Access front from DNS name [DNS] ex: http://front.cloudllabs.link


### CI/CD
- Change some code: `nano src/pages/index.js` 
- Push code in github
- Check the status of CI/CD in codebuild
- Check your app again

### Destroy all
- Destroy all components: 
```
cd cloudformation
./delete-stacks.sh ${CF_DEMO_ENVIRONMENT} [DNS]

Ex:
./delete-stacks.sh ${CF_DEMO_ENVIRONMENT} front.cloudlabs.link
```

## To do
- [x] Destroy stack
- [ ] Cert + DNS
- [x] Fix build

## Annexes

### SSM variable
- To register manually variables in SSM, so codebuild CI/CD can use them later:
```
aws ssm put-parameter --name "/master/myapp/api_url" --value "<YOUR_API_URL>" --type String --overwrite
aws ssm put-parameter --name "/master/myapp/api_key" --value "<YOUR_API_KEY>" --type SecureString --overwrite

aws ssm put-parameter --name "/master/myapp/api_url" --value "hxaxon4jz9.execute-api.eu-west-1.amazonaws.com/Prod/" --type String --overwrite  <-- as an example
```
- Check with `aws ssm describe-parameters --filters "Key=Name,Values=/master/myapp"`
- `aws ssm get-parameter --name "/master/myapp/api_url" --with-decryption`

### Local Codebuild: 
- Download + build docker [here](https://github.com/aws/aws-codebuild-docker-images/tree/master/ubuntu/standard/3.0)
- Download codebuild_build.sh [here](https://github.com/aws/aws-codebuild-docker-images/blob/master/local_builds/codebuild_build.sh)
- Edit `.env` to set the version to deploy [develop|master]
- You need a ./buildspec.yml file with the build code
- Run local build: `./codebuild_build.sh -i aws/codebuild/standard:3.0 -a /tmp/artifacts -s . -e .env.production -c`

