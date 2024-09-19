pipeline {
    agent any
    environment {
        SWARM_MANAGER = "tcp://172.30.0.2:2375"  // Docker API on the Swarm manager (primary node)
        DOCKER_IMAGE_VERSION = "${env.BUILD_ID}" // Unique image tag based on Jenkins build ID
    }
    stages {
        stage('Checkout Code') {
            steps {
                // Checkout code from GitHub using SCM
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Docker images for each service
                    dir('auth-service') {
                        docker.build("auth-service:${DOCKER_IMAGE_VERSION}")
                    }
                    dir('transaction-service') {
                        docker.build("transaction-service:${DOCKER_IMAGE_VERSION}")
                    }
                    dir('user-service') {
                        docker.build("user-service:${DOCKER_IMAGE_VERSION}")
                    }
                }
            }
        }
        stage('Deploy to Swarm') {
            steps {
                script {
                    // Connect to the Swarm Manager on the primary node and deploy the services
                    withDockerServer([uri: "${SWARM_MANAGER}"]) {
                        sh """
                        # Deploy/Update auth-service
                        docker service update --image auth-service:${DOCKER_IMAGE_VERSION} auth-service || \
                        docker service create --name auth-service --replicas 3 --publish 3001:3000 auth-service:${DOCKER_IMAGE_VERSION}
                        
                        # Deploy/Update transaction-service
                        docker service update --image transaction-service:${DOCKER_IMAGE_VERSION} transaction-service || \
                        docker service create --name transaction-service --replicas 3 --publish 3002:3000 transaction-service:${DOCKER_IMAGE_VERSION}
                        
                        # Deploy/Update user-service
                        docker service update --image user-service:${DOCKER_IMAGE_VERSION} user-service || \
                        docker service create --name user-service --replicas 3 --publish 3003:3000 user-service:${DOCKER_IMAGE_VERSION}
                        """
                    }
                }
            }
        }
    }
}
