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
						
							sh "npm install"
							sh "echo 'App Linting'"
							sh "npm run lint"
					
							
							
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
				sh "docker tag `echo $buildID` `echo $dockerpath`:`echo $buildID`"
				sh "docker push `echo $dockerpath`"
			}
		}

		stage('Remove Unused docker image') {
				steps {
					sh "docker rmi -f `echo $buildID`"
				}
		}

		stage('Deploy Docker Image to EKS') {
				steps {
					withAWS(credentials: 'aws-cred', region: 'us-west-2') {
						sh "echo 'Get EKS kubeconfig'"
						sh "aws eks --region us-west-2 update-kubeconfig --name risk-ident-ekscluster"
						sh "kubectl get nodes"
						sh "kubectl apply -f ./deployment.yaml"
						sh "sleep 2m"
						sh "kubectl set image deployments/risk-ident risk-ident=`echo $dockerpath`:`echo $buildID`"
						sh "kubectl get deployment"
						sh "kubectl get pods"
						sh "kubectl rollout status deployments/risk-ident"
						sh "kubectl get svc"	
					}

				}
			}
	}
}