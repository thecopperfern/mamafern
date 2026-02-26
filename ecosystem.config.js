module.exports = {
  apps: [
    {
      name: "mamafern",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Restart if memory exceeds 512MB
      max_memory_restart: "512M",
      // Auto-restart when a new build lands
      watch: [".next/BUILD_ID"],
      watch_delay: 3000,
      // Don't count watch-triggered restarts as crashes
      autorestart: true,
      // Log configuration
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
