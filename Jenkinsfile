pipeline {
    agent any

    environment {
        SWARM_MANAGER_IP = '192.168.0.138'
        DOCKERHUB_USERNAME = 'bamlakhiruy' // Your Docker Hub username
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['auth-service', 'transaction-service', 'user-service']
                    services.each { service ->
                        docker.build("${service}:latest", "./${service}")
                        // Tag the image for Docker Hub
                        sh "docker tag ${service}:latest ${DOCKERHUB_USERNAME}/${service}:latest"
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                // Use stored credentials for Docker Hub login without interpolation
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    def services = ['auth-service', 'transaction-service', 'user-service']
                    services.each { service ->
                        // Push the images to Docker Hub
                        sh "docker push ${DOCKERHUB_USERNAME}/${service}:latest"
                    }
                }
            }
        }

        stage('Deploy to Swarm') {
            steps {
                script {
                    // Deploy the stack
                    sh """
                    docker stack deploy -c docker-compose.yml microservices-stack
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
