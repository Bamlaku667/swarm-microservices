pipeline {
    agent any

    environment {
        DOCKER_HOST = 'tcp://192.168.0.138:2375' // Replace with your Red Hat server IP and port
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials' // Jenkins ID for Docker Hub credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['auth-service', 'transaction-service', 'user-service']
                    services.each { service ->
                        docker.build("${service}:latest", "./${service}")
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    def services = ['auth-service', 'transaction-service', 'user-service']
                    services.each { service ->
                        docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                            docker.image("${service}:latest").push('latest')
                        }
                    }
                }
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                script {
                    sh """
                    docker -H ${DOCKER_HOST} stack deploy -c docker-compose.yml microservices-stack
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
