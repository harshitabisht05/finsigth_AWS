const { STSClient, AssumeRoleCommand, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
const { CostExplorerClient } = require("@aws-sdk/client-cost-explorer");
const { BudgetsClient } = require("@aws-sdk/client-budgets");
const { EC2Client } = require("@aws-sdk/client-ec2");
const { CloudWatchClient } = require("@aws-sdk/client-cloudwatch");
const { S3Client } = require("@aws-sdk/client-s3");
const { RDSClient } = require("@aws-sdk/client-rds");

const region = process.env.AWS_REGION || "us-east-1";

function getAccountIdFromRoleArn(roleArn) {
  const m = roleArn.match(/arn:aws:iam::(\d{12}):role\/.+/);
  return m ? m[1] : null;
}

async function assumeRole(roleArn, externalId) {
  const sts = new STSClient({ region });
  const res = await sts.send(new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: `finsight-session-${Date.now()}`,
    ExternalId: externalId,
    DurationSeconds: 3600,
  }));

  if (!res.Credentials) throw new Error("Unable to assume role");

  return {
    accessKeyId: res.Credentials.AccessKeyId,
    secretAccessKey: res.Credentials.SecretAccessKey,
    sessionToken: res.Credentials.SessionToken,
  };
}

async function validateAssumeRole(roleArn, externalId) {
  const credentials = await assumeRole(roleArn, externalId);
  const sts = new STSClient({ region, credentials });
  await sts.send(new GetCallerIdentityCommand({}));
  return true;
}

async function getAwsClients(account) {
  const credentials = await assumeRole(account.role_arn, account.external_id);
  return {
    accountId: getAccountIdFromRoleArn(account.role_arn),
    ce: new CostExplorerClient({ region, credentials }),
    budgets: new BudgetsClient({ region, credentials }),
    ec2: new EC2Client({ region, credentials }),
    cloudwatch: new CloudWatchClient({ region, credentials }),
    s3: new S3Client({ region, credentials }),
    rds: new RDSClient({ region, credentials }),
  };
}

module.exports = { validateAssumeRole, getAwsClients };
