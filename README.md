# MyApp: a demo front in Gatsby in aws

## Overview
- Front: reactjs in S3 hosting + cloudfront
- CI: Codebuild
- Infra: Cloudformation in AWS

## Initialisation

### API check
- You need to have the `myapp-api` running with the url and keys
- Go to repo `myapp-demo-api` and deploy it
- Retreive the codebuild output and get the api url and keys
- Register both variable in SSM:
```
aws ssm put-parameter --name "/master/myapp/api_url" --value "<YOUR_API_URL>" --type String --overwrite
aws ssm put-parameter --name "/master/myapp/api_key" --value "<YOUR_API_KEY>" --type SecureString --overwrite

aws ssm put-parameter --name "/master/myapp/api_url" --value "pxh15s5fzi.execute-api.eu-west-1.amazonaws.com/Prod/hello" --type String --overwrite  <-- as an example
```
- Check with `aws ssm describe-parameters --filters "Key=Name,Values=/master/myapp"`
- `aws ssm get-parameter --name "/master/myapp/api_url" --with-decryption`
- To update: `... --overwrite`


## Front requisite
- Optional: create a certificate for this API e.g.: `*.myapp.cloudlabs.link`
- Set AWS to deploy in `eu-west-1`: `nano ~/.aws/config`
- First create the infra (S3 bucket & Cloudfront & Codebuild):

```
cd cloudformation
nano main.yml <-- edit with your needs
aws cloudformation create-stack --stack-name myapp-demo-front-infra-init --template-body file://main.yml --capabilities CAPABILITY_NAMED_IAM
... update-stack ... <-- if already created
```

## Deploy FRONT

### Deploy manually
- Follow code in buildspec.yml to deploy manually (or use local build, see in annexes).

### Deploy via CI
- Edit ci with your needs: `nano buildspec.yml`
- Push code to master or develop for auto CI/CD
- For local build, see in annexes.

### Check
- S3 [url](http://myapp.cloudlabs.link.s3-website-eu-west-1.amazonaws.com/)
- Domain [url](https://myapp.cloudllabs.link) via cloudfront + cert

## Destroy all
- Destroy using the right region: `aws cloudformation delete-stack --stack-name <YOUR_STACK_NAME> --region eu-west-1`

### Dev
- Run local gatsby: `gatsby develop` 
- Browser http://127.0.0.1:8000

Todo:
- [x] Cloudformation init
- [x] Ci create + delete stack
- [x] Add route53 domain
- [ ] Parameters SSM [here](https://www.youtube.com/watch?v=mDzjTe9WMnY&list=PLGyRwGktEFqe3-M1EfbpRX_syICmytNWx&index=8)
  - Check CORS: lambda proxy/ not, 
- [ ] Codebuild locally
- [ ] Dev + Prod?

## Annexes

### Local Codebuild: 
- Download + build docker [here](https://github.com/aws/aws-codebuild-docker-images/tree/master/ubuntu/standard/3.0)
- Download codebuild_build.sh [here](https://github.com/aws/aws-codebuild-docker-images/blob/master/local_builds/codebuild_build.sh)
- Edit `.env` to set the version to deploy [develop|master]
- Run local build: `./codebuild_build.sh -i aws/codebuild/standard:3.0 -a /tmp/artifacts -s . -e .env.development -c`