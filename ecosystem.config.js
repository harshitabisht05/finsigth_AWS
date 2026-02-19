module.exports = {
  apps: [{
    name: "finsight-backend",
    script: "server.js",
    cwd: "./backend",
    instances: 1,
    exec_mode: "fork",
    env: { NODE_ENV: "production" },
  }],
};
