#!/bin/bash
set -ex

ENV_NAME_ARG=$1
BRANCH=$2

INFRA_STACK=${ENV_NAME_ARG}-front-infra


###############################################################################
# Delete the S3 bucket used to store SAM Cloud Formation templates. Cloud Formation
# won't delete a stack which provisioned an S3 bucket which is non-empty - so
# this must happen first.
#

if aws s3 ls s3://${INFRA_STACK}; then
    aws s3 rb s3://${INFRA_STACK} --force || true
fi


###############################################################################
# Delete all the stacks we've created.
#

if aws cloudformation describe-stacks --stack-name ${INFRA_STACK}; then
    aws cloudformation delete-stack --stack-name ${INFRA_STACK} || true
    aws cloudformation wait stack-delete-complete --stack-name ${INFRA_STACK}
fi

echo "$(date):delete:${ENV_NAME_ARG}:success"