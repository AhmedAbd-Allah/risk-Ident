def buildID = ""
def dockerpath = "ahmedabdallah7/risk-ident"


pipeline {
  agent any
  stages {
	stage('Generate Build ID'){
		steps {
			sh "echo 'Generating BuildID'"
			script {
				buildID = sh(script: 'uuidgen', returnStdout: true)
			}
			sh "echo 'Build ID: $buildID'"					
		}
	}
	stage('Linting') {
		steps {
			sh "pwd"
			sh "npm install"
			sh "echo 'App Linting'"
			sh "npm run lint"
		}
	}
	stage('Building Docker Image') {
		steps {
			sh "echo 'Building Docker Image'"
			sh "docker build --tag=`echo $buildID` ."
		}
	}


	stage('Push Image to Dockerhub') {
		steps {
			sh "echo 'Pushing Docker Image to Dockerhub'"
			sh "echo 'Docker Image ID: $buildID'"
			sh "docker login"
			sh "docker tag `echo $buildID` $dockerpath"
			sh "docker push $dockerpath"
		}
	}


  }
}