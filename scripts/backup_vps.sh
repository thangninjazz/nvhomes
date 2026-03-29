#!/bin/bash

# Configuration
PROJECT_NAME="nvhome"
BACKUP_DIR="$HOME/nvhome_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=7

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "--- Starting Backup: $TIMESTAMP ---"

# 1. Database Backup (PostgreSQL)
echo "Dumping database..."
docker exec nvhome_db pg_dump -U postgres nvhomedb > "$BACKUP_DIR/db_dump.sql"

# 2. Uploads Backup (Docker Volume)
echo "Packing uploads..."
docker run --rm -v nvhome_backend_uploads:/data -v "$BACKUP_DIR":/backup alpine tar czf /backup/uploads_backup.tar.gz -C /data .

# 3. Code & Config Backup
echo "Packing code and configs..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$HOME/nvhome" . -C "$BACKUP_DIR" db_dump.sql uploads_backup.tar.gz

# 4. Cleanup temporary files
rm "$BACKUP_DIR/db_dump.sql"
rm "$BACKUP_DIR/uploads_backup.tar.gz"

# 5. Rclone Upload (If configured)
if command -v rclone &> /dev/null; then
    if rclone listremotes | grep -q "gdrive:"; then
        echo "Uploading to Google Drive..."
        rclone copy "$BACKUP_DIR/$BACKUP_NAME" gdrive:NVHome_Backups
        echo "Upload complete."
    else
        echo "Rclone 'gdrive:' remote not found. Skipping cloud upload."
    fi
else
    echo "Rclone not installed. Skipping cloud upload."
fi

# 6. Cleanup old local backups
echo "Cleaning up local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 7. Telegram Notification
if [ -f "$HOME/nvhome/.env" ]; then
    BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$HOME/nvhome/.env" | cut -d '=' -f 2 | tr -d '\r')
    CHAT_ID=$(grep '^TELEGRAM_CHAT_ID=' "$HOME/nvhome/.env" | cut -d '=' -f 2 | tr -d '\r')
    
    if [ ! -z "$BOT_TOKEN" ] && [ ! -z "$CHAT_ID" ]; then
        FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null | cut -f 1)
        if [ -z "$FILE_SIZE" ]; then FILE_SIZE="Unknown"; fi
        
        # Check if backup was successful (file exists and is not empty)
        if [ -s "$BACKUP_DIR/$BACKUP_NAME" ]; then
            MESSAGE="📦 <b>NVHome Backup - THÀNH CÔNG</b>%0A---------------------------%0A🕒 Thời gian: $(date +'%H:%M:%S %d/%m/%Y')%0A📄 File: <code>${BACKUP_NAME}</code>%0A⚖️ Dung lượng: <b>${FILE_SIZE}</b>%0A☁️ Cloud: Google Drive ✅"
        else
            MESSAGE="⚠️ <b>NVHome Backup - THẤT BẠI</b>%0A---------------------------%0A🕒 Thời gian: $(date +'%H:%M:%S %d/%m/%Y')%0A❌ Lỗi: Không tạo được file backup hoặc file trống."
        fi

        curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
            -d "chat_id=${CHAT_ID}" \
            -d "text=${MESSAGE}" \
            -d "parse_mode=HTML" > /dev/null
        echo "Telegram notification sent."
    fi
fi

echo "--- Backup Completed: $(date) ---"
