#!/usr/bin/env bash
set -euo pipefail
P=/mnt/c/Dev/it-support-simulator/.git/stage-v11
DB=itsim_v11_homolog
pg() { runuser -u postgres -- psql -X -v ON_ERROR_STOP=1 -d "$DB" "$@"; }
echo '=== Local DB (NO CLOUD) security rollback ==='
pg -f "$P/docs/SUPABASE-HARDENING-ROLLBACK-REVIEW.sql"
echo '=== Verify rollback ==='
pg -f "$P/tests/db-homologation-rollback-check.sql"
echo '=== Reapply security migration ==='
pg -f "$P/docs/SUPABASE-HARDENING-REVIEW.sql"
echo '=== Verify secured state ==='
pg -f "$P/tests/db-homologation-smoke.sql"
echo '=== ROUNDTRIP SUCCESS ==='
