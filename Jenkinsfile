import hudson.tasks.junit.TestResultSummary

String lastRunningStage; 

pipeline {
  agent { label 'master' }

  tools {
    nodejs "nodejs18.12.1"
  }

  options {
    disableConcurrentBuilds()
  }
  
  environment {
    DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/866587609055887391/kYVKgutodLsnAwLCCIpudEqenPVRsMSDVG84x1rmx-Jr2fc4ttjwVJq6mBp00ciWt-ku'
  }

  stages {

    stage('Project Init') {
      steps {
        script {
          lastRunningStage="Project Init"
        }
        nodejs(nodeJSInstallationName: 'nodejs18.12.1') {
          sh 'npm ci'
        }
      }
    }
    
    stage("Lint") {
      steps {
          script {
            lastRunningStage="Lint"
          }
          nodejs(nodeJSInstallationName: 'nodejs18.12.1') {
            sh 'npm run lint'
          }
      }
    }

    stage("Build") {
      when {
        anyOf {
          branch 'develop';
          branch 'master'
        }
      }
      steps {
        script {
          lastRunningStage = 'Build'
        }
        nodejs(nodeJSInstallationName: 'nodejs18.12.1') {
          sh 'npm run build'
        }
      }
    }

    stage("Publish") {
      when {
        anyOf {
          branch 'master'
        }
      }
      steps {
        script {
          lastRunningStage = 'Publish'
          withCredentials([string(credentialsId: 'quinck-npm-token', variable: 'NPM_TOKEN')]) {
            sh '''
              set +x
              echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
              npm whoami
              
              PUBLISHED_VERSION=$(npm show @quinck/collections version)
              PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
              if [ "${PUBLISHED_VERSION}" = "${PACKAGE_VERSION}" ]; then
                echo "The current package version has already been published"
              else
                echo "Do pubblication"
                npm publish --access public
              fi
              
              rm .npmrc
            '''
          }
        }
      }
    }
  }

  post {
    always {
      script {
        String rootDir = pwd()
        def notifier = load "${rootDir}/configs/pipeline/jenkins/notifyDiscord.groovy"
        def testResult
        try { 
          testResult = junit "test-results.xml"
        } catch(Exception e) {
          echo 'No test results available'
        }
        notifier.notifyDiscord(currentBuild.result, lastRunningStage, testResult)
        deleteDir() /* clean up our workspace */
      }
    }
    failure {
      script {
        deleteDir() /* clean up our workspace */
        sh 'exit 1'
      }
    }
  }
}