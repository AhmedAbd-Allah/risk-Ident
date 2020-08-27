def buildID = ""
def dockerpath = "ahmedabdallah7/risk-ident"
def dockerImage

pipeline {
  environment {
	dockerhubCredentials = 'ahmedabdallah7'
  }
  agent any
  triggers {
    githubPush()
  }
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
			sh "npm install"
			sh "echo 'App Linting'"
			sh "npm run lint"
		}
	}
	stage('Building Docker Image and push to Dockerhub') {


		steps {
			script {
				sh "echo 'Building Docker Image'"
				dockerImage = docker.build("$dockerpath:$buildID", ".")
			}
		}


	}


	stage('Push Image to Dockerhub') {
		steps {
			sh "echo 'Pushing Docker Image to Dockerhub'"
			sh "echo 'Docker Image ID: $buildID'"
			script {
				docker.withRegistry('', dockerhubCredentials) {
					dockerImage.push()
				}
			}
 
		
		}
	}


  }
}