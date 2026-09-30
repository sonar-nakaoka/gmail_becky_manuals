import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

const GITHUB_TOKEN_SECRET_NAME = '/amplify/gmail-becky-manuals/github-token';
const BASIC_AUTH_SECRET_NAME = '/amplify/gmail-becky-manuals/basic-auth';

const BUILD_SPEC = [
  'version: 1',
  'frontend:',
  '  phases: {}',
  '  artifacts:',
  '    baseDirectory: public',
  '    files:',
  "      - '**/*'",
  '  cache:',
  '    paths: []',
].join('\n');

export interface HostingStackProps extends cdk.StackProps {
  readonly githubOwner: string;
  readonly githubRepoName: string;
}

export class GmailBeckyManualsHostingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    const githubToken = cdk.SecretValue.secretsManager(GITHUB_TOKEN_SECRET_NAME);
    const basicAuthUsername = cdk.SecretValue.secretsManager(BASIC_AUTH_SECRET_NAME, {
      jsonField: 'username',
    });
    const basicAuthPassword = cdk.SecretValue.secretsManager(BASIC_AUTH_SECRET_NAME, {
      jsonField: 'password',
    });

    const app = new amplify.CfnApp(this, 'App', {
      name: 'gmail-becky-manuals',
      repository: `https://github.com/${props.githubOwner}/${props.githubRepoName}`,
      oauthToken: githubToken.unsafeUnwrap(),
      buildSpec: BUILD_SPEC,
      basicAuthConfig: {
        enableBasicAuth: true,
        username: basicAuthUsername.unsafeUnwrap(),
        password: basicAuthPassword.unsafeUnwrap(),
      },
    });

    new amplify.CfnBranch(this, 'MainBranch', {
      appId: app.attrAppId,
      branchName: 'main',
      enableAutoBuild: true,
    });
  }
}
