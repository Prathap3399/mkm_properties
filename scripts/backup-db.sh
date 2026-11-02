#!/usr/bin/env bash
# ==============================================================================
# MKM Properties - Automated SQLite Database Backup Script
# Performs non-blocking atomic online backup with WAL checkpointing
# ==============================================================================

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="${APP_DIR}/data"
DB_FILE="${DATA_DIR}/mkm_properties.db"
BACKUP_DIR="${APP_DIR}/backups"
TIMESTAMP="$(date +'%Y-%m-%d_%H%M%S')"
BACKUP_FILE="${BACKUP_DIR}/mkm_properties_${TIMESTAMP}.db"
DAYS_TO_KEEP=30

mkdir -p "${BACKUP_DIR}"

if [ ! -f "${DB_FILE}" ]; then
  echo "❌ Error: Database file ${DB_FILE} does not exist."
  exit 1
fi

echo "📦 Starting atomic online SQLite backup..."
# SQLite online backup command (.backup safe with concurrent writes)
sqlite3 "${DB_FILE}" ".backup '${BACKUP_FILE}'"

# Compress backup
gzip -9 "${BACKUP_FILE}"
echo "✅ Backup successfully created: ${BACKUP_FILE}.gz"

# Prune backups older than DAYS_TO_KEEP
echo "🧹 Pruning backups older than ${DAYS_TO_KEEP} days..."
find "${BACKUP_DIR}" -name "mkm_properties_*.db.gz" -type f -mtime "+${DAYS_TO_KEEP}" -delete

echo "✨ Backup job finished successfully."

