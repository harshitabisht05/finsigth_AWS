const { DescribeInstancesCommand, DescribeVolumesCommand } = require("@aws-sdk/client-ec2");
const { GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");
const { ListBucketsCommand, GetBucketLifecycleConfigurationCommand } = require("@aws-sdk/client-s3");
const { DescribeDBInstancesCommand } = require("@aws-sdk/client-rds");
const { getAwsClients } = require("./awsClientService");

function daysBetween(a, b) { return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)); }

async function avgCpu(cloudwatch, id, namespace, dimensionName) {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const r = await cloudwatch.send(new GetMetricStatisticsCommand({
    Namespace: namespace,
    MetricName: "CPUUtilization",
    Dimensions: [{ Name: dimensionName, Value: id }],
    StartTime: start,
    EndTime: end,
    Period: 3600,
    Statistics: ["Average"],
  }));
  const d = r.Datapoints || [];
  if (!d.length) return 0;
  const s = d.reduce((a, p) => a + Number(p.Average || 0), 0);
  return s / d.length;
}

async function detectFor(account) {
  const { ec2, cloudwatch, s3, rds } = await getAwsClients(account);
  const findings = [];

  const ins = await ec2.send(new DescribeInstancesCommand({}));
  const list = (ins.Reservations || []).flatMap((r) => r.Instances || []);

  for (const instance of list) {
    const state = instance.State?.Name;
    const id = instance.InstanceId;

    if (state === "running" && instance.LaunchTime && daysBetween(new Date(), new Date(instance.LaunchTime)) > 7) {
      findings.push({ type: "warning", message: `EC2 instance ${id} has been running for more than 7 days.` });
      const cpu = await avgCpu(cloudwatch, id, "AWS/EC2", "InstanceId");
      if (cpu < 5) findings.push({ type: "warning", message: `EC2 instance ${id} has average CPU below 5% in the last 7 days.` });
    }

    if (state === "stopped") findings.push({ type: "info", message: `EC2 instance ${id} is stopped and can be reviewed for cleanup.` });
  }

  const vols = await ec2.send(new DescribeVolumesCommand({ Filters: [{ Name: "status", Values: ["available"] }] }));
  (vols.Volumes || []).forEach((v) => findings.push({ type: "warning", message: `EBS volume ${v.VolumeId} is unattached and may be incurring unnecessary cost.` }));

  const buckets = await s3.send(new ListBucketsCommand({}));
  for (const b of buckets.Buckets || []) {
    try {
      await s3.send(new GetBucketLifecycleConfigurationCommand({ Bucket: b.Name }));
    } catch {
      findings.push({ type: "info", message: `S3 bucket ${b.Name} does not have lifecycle rules configured.` });
    }
  }

  const dbs = await rds.send(new DescribeDBInstancesCommand({}));
  for (const db of dbs.DBInstances || []) {
    const id = db.DBInstanceIdentifier;
    const cpu = await avgCpu(cloudwatch, id, "AWS/RDS", "DBInstanceIdentifier");
    if (cpu < 10) findings.push({ type: "info", message: `RDS instance ${id} appears underutilized with CPU below 10%.` });
  }

  return findings;
}

async function detectCostLeaks(accounts) {
  if (!accounts.length) return [];
  const all = await Promise.all(accounts.map(detectFor));
  return all.flat();
}

module.exports = { detectCostLeaks };
