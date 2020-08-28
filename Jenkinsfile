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
			script {
						try {
								sh "npm install"
								sh "echo 'App Linting'"
								sh "npm run lint"
						} catch (Exception e) {
								
						}
					}
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
			withCredentials([usernamePassword(credentialsId: 'dockerCred', passwordVariable: 'dockerhubPass', usernameVariable: "dockerhubUser")]) {
				sh	"docker login -u ${dockerhubUser} -p ${dockerhubPass}"
			}
		
			sh "docker push $buildID"
		
		
		}
	}


  }
}