module.exports = {
  apps: [
    {
      name: 'oceantune',
      cwd: '/var/www/oceantune',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      out_file: '/var/log/oceantune-out.log',
      error_file: '/var/log/oceantune-err.log',
      merge_logs: true,
      time: true,
    },
  ],
};