#!/bin/bash
set -ex

ENV_NAME_ARG=$1
GITHUB_REPO=$2
DNS=$3
export GATSBY_API_URL=$4
export GATSBY_API_KEY=$5

INFRA_STACK=${ENV_NAME_ARG}-front-infra

# Deploy Bucket, CodeBuild
if ! aws cloudformation describe-stacks --stack-name ${ENV_NAME_ARG}-infra; then
    aws cloudformation deploy --stack-name ${INFRA_STACK} \
        --capabilities CAPABILITY_NAMED_IAM \
        --template-file ./main.yml \
        --parameter-overrides \
            GitHubRepo=${GITHUB_REPO} \
            Dns=${DNS}
fi

# Load api variable to SSM, for codebuild to use later
aws ssm put-parameter --name "/master/myapp/api_url" --value ${GATSBY_API_URL} --type String --overwrite
aws ssm put-parameter --name "/master/myapp/api_key" --value ${GATSBY_API_KEY} --type SecureString --overwrite

# Gatsby Build
cd ..
npm install
./node_modules/.bin/gatsby build --prefix-paths

# Copy site to S3
#aws s3 cp public s3://${DNS} --recursive
aws s3 sync --delete public s3://${DNS}

echo "$(date):create:${INFRA_STACK}:success"