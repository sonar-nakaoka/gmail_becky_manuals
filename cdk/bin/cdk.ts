#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { GmailBeckyManualsHostingStack } from '../lib/hosting-stack';

const app = new cdk.App();

const githubOwner = app.node.tryGetContext('githubOwner') as string | undefined;
const githubRepoName = app.node.tryGetContext('githubRepoName') as string | undefined;

if (!githubOwner || githubOwner.startsWith('PLACEHOLDER_')) {
  throw new Error(
    'cdk.json の context.githubOwner を実際の GitHub オーナー名に書き換えてください'
  );
}
if (!githubRepoName || githubRepoName.startsWith('PLACEHOLDER_')) {
  throw new Error(
    'cdk.json の context.githubRepoName を実際のリポジトリ名に書き換えてください'
  );
}

new GmailBeckyManualsHostingStack(app, 'GmailBeckyManualsHostingStack', {
  githubOwner,
  githubRepoName,
});
