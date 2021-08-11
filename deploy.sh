#!/bin/sh

ENVIRONMENT="$1"

if [ "$ENVIRONMENT" == "dev" ]; then
    PROJECT_ID="nansen-contract-parser-dev"
    FIREBASE_PROJECT_ID="nansen-contract-parser-dev"
 
elif [ "$ENVIRONMENT" == "prod" ]; then
    PROJECT_ID="nansen-contract-parser-prod"
    FIREBASE_PROJECT_ID="nansen-contract-parser-prod"
  
else
    echo "Unknown environment"
    exit 1
fi

gcloud builds submit contract-parser-api \
  --project ${PROJECT_ID} \
  --tag gcr.io/${PROJECT_ID}/contract-parser-api && \
gcloud run deploy contract-parser-api \
  --project ${PROJECT_ID} \
  --image gcr.io/${PROJECT_ID}/contract-parser-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account="contract-parser-api@${PROJECT_ID}.iam.gserviceaccount.com" \
  --set-env-vars "PROJECT_ID=${PROJECT_ID},FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}"