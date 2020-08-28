def buildID = ""
def dockerpath = "ahmedabdallah7/risk-ident"
def dockerImage

pipeline {
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
	stage('Building Docker Image') {


		steps {
			script {
				sh "echo 'Building Docker Image'"
				sh "docker build --tag=`echo $buildID` ."
			}
		}


	}


	stage('Push Image to Dockerhub') {
		steps {
			sh "echo 'Pushing Docker Image to Dockerhub'"
			sh "echo 'Docker Image ID: $buildID'"
			withCredentials([string(credentialsId: 'dockerCred', variable: 'dockerhubpwd')]) {
				sh	"docker login -u ahmedabdallah7 -p ${dockerhubpwd}"
			}
			sh "docker tag $buildID $dockerpath"
			sh "docker push $dockerpath"
		
		
		}
	}


  }
}