#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
port="$2"
timeout="${3:-30}"

for i in $(seq 1 $timeout); do
  if nc -z "$host" "$port" > /dev/null 2>&1; then
    echo "$host:$port is available after $i seconds"
    exit 0
  fi
  echo "Waiting for $host:$port... ($i/$timeout)"
  sleep 1
done

echo "Timeout waiting for $host:$port"
exit 1