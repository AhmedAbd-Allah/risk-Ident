# risk-ident


<h1  align="center"> risk-ident </h1>  <br>

  

<p  align="center">

Further Enhancements : 
 - Use a better logging tool such winston.
 - API documentation with Swagger (OpenAPI 3.0).

</p>


## Table of Contents

-  [Table of Contents](#table-of-contents)

-  [Introduction](#introduction)

-  [CI/CD](#ci/cd)

-  [Technologies](#technologies)

-  [Qwick Start](#quick-start)

-  [Local](#local)

-  [Docker](#docker)

-  [Run Docker](#run-docker)

-  [Testing](#testing)

-  [Linting](#linting)

## Introduction

This project target is to design and develop apis to help Retail24 understand and detect fraud. Fraud officers will use this system to fetch transactions and figure out if it is fraudulent or not, depending on many different parameters. If transactions are identified as fraudulent, the fraud officer can take action by stopping the delivery or changing the payment method, among other things.

  
## CI/CD

Any new Code change passes through several steps to get deployed through the CI/CD:
- After the code got pushed to github repo, the Jenkins pipeline is fired automatically.
- Jenkins pipeline generates a UUID for this specific build
- Then the new code get linted using eslint
- A docker image is built for the new version of application
- The docker image is then pushed to dockerhub
- The docker image is then passed to EKS (Amazon Elastic Kubernetes Service)
- The new docker image is deployed and can be accessed via your browser

## Technologies
- The application is built using several technologies:
* Node.js
* TypeScript
* Nest.js
* Docker
* Jenkins
* Kubernetes (EKS)
   

## Quick Start

To run the application locally:
- Clone the application
- browse to application directory
- run `npm run start`
- application is accessible from your browser `http://localhost:3000/api` and then hit the      requested endpoint



### Run Docker

To run the application using docker:

- Clone the application
- change directory to application directory
- run `docker build --tag=risk-ident .`
- run `docker run risk-ident`
- application is accessible from your browser `http://localhost:3000/api` and then hit the      requested endpoint

  
  

## Testing
To run unit tests, go to project directory and run 
    `npm run test`

## Linting
To Lint the app using eslint, go to project directory and run 
    `npm run lint`
