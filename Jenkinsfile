pipeline {
    agent any

    environment {
        SWARM_MANAGER_IP = '192.168.0.18'
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
                    }
                }
            }
        }

        stage('Deploy to Swarm') {
            steps {
                script {
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
