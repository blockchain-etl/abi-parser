# Contract Parser / ABI Parser

## Introduction

The following project is to make it simple to build table defenitions for ETL on multiple chains.

Currently it supports:

- Ethereum
- Polygon
- Binance Smart Chain

## Architecture

The project is broken into two-parts

### Frontend

This is a simple react app.

1. Lets user input addresses or ABI.
2. This is then sent to the backend to get the table defentions.
3. Once table defenitions are fetched, they are displayed allowing you to rename the dataset name and contract name.
4. Once the names have been set, you can simply download the created table defenitions for events or function calls.

## Backend

This is a simple python flask app.

Has multiple endpoints that returns either abi or table defenitions.

Currently it works by connecting to Etherscan based explorer api's to grab the ABI from contract address.

It currently supports grabbing data from etherscan, polygonscan and bscscan

## Hosting

Read below to understand how the project is deployed

### Frontend

This is hosted on firebase. Currently there are two version of this.

| Version     | Firebase Project Name       |
| ----------- | --------------------------- |
| Development | nansen-contract-parser-dev  |
| Production  | nansen-contract-parser-prod |

There are two important files that tell firebase how to host this, [.firebaserc](frontend/.firebaserc) and [firebase.json](frontend/firebase.json)

the build commands are specified in [package.json](frontend/package.json)

It is important for you to have `firebase-tools` installed. You can install this by running

```
npm install -g firebase-tools
```

Once installed you will need to login to firebase, this can be done using the command below

```
firebase login
```

Once logged in you should be able to deploy the frontend

### _Deployment_

To deploy to dev:

```bash
firebase use dev
yarn build:dev
yarn deploy:dev
```

To deploy to prod:

```bash
firebase use prod
yarn build:prod
yarn deploy:prod
```

### Backend

This is currenty run on cloud-run under the following proejcts

| Version     | GCP Project Name            |
| ----------- | --------------------------- |
| Development | nansen-contract-parser-dev  |
| Production  | nansen-contract-parser-prod |

There are a few important files that tell cloudrun how to run this properlly. [Dockerfile](contract-parser-api/Dockerfile) tells google how to run the containerized version of the project. [iam.sh](iam.sh) is a helper script to create the necessary service workers and set the correct roles. [deploy.sh](deploy.sh) is used to deploy the project in production and development environments.

It is important that you have installed and intialized [gcloud sdk](https://cloud.google.com/sdk/docs/install)

You can run the following command to login with your nansen email

```
gcloud auth login
```

### _Deployment_

1. If this is the first time deploying run `bash iam.sh dev`, or `bash iam.sh prod`
2. Next you can run `bash deploy.sh dev` or `bash deploy.sh prod` to deploy the backend to dev or prod set-up
