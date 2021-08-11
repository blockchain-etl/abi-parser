#!/bin/sh

ENVIRONMENT="$1"

if [ "$ENVIRONMENT" == "dev" ]; then
    PROJECT_ID="nansen-contract-parser-dev"
elif [ "$ENVIRONMENT" == "prod" ]; then
    PROJECT_ID="nansen-contract-parser-prod"
else
    echo "Unknown environment"
    exit 1
fi

#  Create or select a service account for the run serice
gcloud iam service-accounts create contract-parser-api \
  --project=${PROJECT_ID} \
  --display-name "Cloud Run runtime service account for nansen-contract-parser service"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:contract-parser-api@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# # Let this account publish to pubsub for debugging
# gcloud projects add-iam-policy-binding ${PROJECT_ID} \
#   --member="serviceAccount:nansen-internal-api@${PROJECT_ID}.iam.gserviceaccount.com" \
#   --role="roles/firebase.admin"