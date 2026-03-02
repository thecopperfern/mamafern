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
      // Crash protection: stop restarting after 10 crashes in quick succession
      max_restarts: 10,
      // Wait 2s between restart attempts
      restart_delay: 2000,
      // Give the process 5s to clean up on stop/restart
      kill_timeout: 5000,
      // Log configuration
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
