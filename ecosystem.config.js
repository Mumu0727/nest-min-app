/* eslint-disable prettier/prettier */
module.exports = {
  apps: [
    {
      name: 'minApp', // 项目名字,启动后的名字
      script: './dist/main.js', // 执行的文件
      cwd: './', // 根目录
      args: '', // 传递给脚本的参数
      kill_timeout: 3000, //终止超时
      watch: true, // 开启监听文件变动重启
      // ignore_watch: ['node_modules', 'public', 'logs'], // 不用监听的文件
      // exec_mode: 'cluster_mode',// 开启进程间的负载均衡模式
      // instances: '2', // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: '1G',
      instance_var: 'INSTANCE_ID', // 自定义环境变量路径名，可避免与其他环境变量名冲突
      // log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      // error_file: './logs/app-err.log', // 错误日志文件
      // out_file: './logs/app-out.log', // 正常日志文件
      // merge_logs: true, // 设置追加日志而不是新建日志
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
    },
  ],
};
