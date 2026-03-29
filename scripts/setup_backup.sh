#!/bin/bash

# Configuration
BACKUP_SCRIPT="$HOME/nvhome/scripts/backup_vps.sh"
CRON_JOB="0 20 * * * /bin/bash $BACKUP_SCRIPT >> $HOME/nvhome_backups/backup.log 2>&1"

# 1. Install Rclone (Latest version from official script)
if ! command -v rclone &> /dev/null; then
    echo "Installing latest rclone..."
    sudo curl https://rclone.org/install.sh | sudo bash
fi

# 2. Add Cron Job (8:00 PM UTC = 3:00 AM VN)
# Check if cron job already exists to avoid duplicates
(crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT"; echo "$CRON_JOB") | crontab -

echo "--- Setup Complete ---"
echo "1. Script located at: $BACKUP_SCRIPT"
echo "2. Cron Job scheduled for 3:00 AM VN Time (8 PM UTC)."
echo "3. Action needed: Run 'rclone config' to connect Google Drive (Name it 'gdrive')."
