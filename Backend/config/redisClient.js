import redis from 'redis'

/*
To check if Redis is installed on your Windows computer using the CLI, follow these steps:
Open Command Prompt
Press Win + R, type cmd, and press Enter.
Check for Redis process
Run:
tasklist | findstr redis

If you see a process like redis-server.exe, Redis is running. If not, Redis might not be installed or not running2.
Check if the Redis command-line client exists
Run:
redis-cli --version

If this prints a version number (like redis-cli 7.0.0), then Redis CLI is installed on your system.
If you see an error like "not recognized," Redis is likely not installed or its installation path is not in the environment variables211.
Try connecting to Redis
If the redis-cli command exists, try:
redis-cli ping

If Redis is running, you'll get: PONG
If you receive an error, either the server isn’t running or not installed properly257.
(Optional) Check installation directory or configuration file
You can check if a typical Redis config file is present:
dir C:\redis\redis.windows.conf

Presence indicates a Redis installation at that path9.
Summary of CLI Commands:
tasklist | findstr redis — Check if Redis process is running
redis-cli --version — Check if Redis CLI is installed
redis-cli ping — Check if Redis server is responsive
dir C:\redis\redis.windows.conf — Look for the configuration file (optional)2911
If any of these steps confirm Redis components' presence, Redis is installed on your system. If all steps fail, Redis is likely not installed or not set up in your PATH.
*/