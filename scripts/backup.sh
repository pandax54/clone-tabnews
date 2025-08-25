#!/bin/bash
CONTAINER_NAME="postgres_container"
DB_NAME="mydb"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

docker exec $CONTAINER_NAME pg_dump -U postgres $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete