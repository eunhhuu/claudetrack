#!/usr/bin/env bash
set -euo pipefail

API_KEY="${1:-}"
API_URL="https://claudetrack.qucord.com/api/ingest"
STATS_FILE="$HOME/.claude/stats-cache.json"
STATE_DIR="$HOME/.claudetrack"
STATE_FILE="$STATE_DIR/last_state.json"
CONFIG_FILE="$STATE_DIR/config.json"
TRACKER_SCRIPT="$STATE_DIR/tracker.sh"

if [ -z "$API_KEY" ]; then
  echo "Usage: curl -s https://claudetrack.qucord.com/install/tracker.sh | bash -s -- <YOUR_API_KEY>"
  exit 1
fi

mkdir -p "$STATE_DIR"

cat > "$CONFIG_FILE" << CONF
{"api_key": "$API_KEY","api_url":"$API_URL"}
CONF

cat > "$TRACKER_SCRIPT" << 'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

STATE_DIR="$HOME/.claudetrack"
CONFIG_FILE="$STATE_DIR/config.json"
STATE_FILE="$STATE_DIR/last_state.json"
STATS_FILE="$HOME/.claude/stats-cache.json"

if [ ! -f "$CONFIG_FILE" ]; then exit 0; fi
if [ ! -f "$STATS_FILE" ]; then exit 0; fi

API_KEY=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['api_key'])" 2>/dev/null || echo "")
API_URL=$(python3 -c "import json; print(json.load(open('$CONFIG_FILE'))['api_url'])" 2>/dev/null || echo "")

if [ -z "$API_KEY" ] || [ -z "$API_URL" ]; then exit 0; fi

python3 << PYEOF
import json, os, sys
from datetime import datetime, timezone

stats_file = os.path.expanduser("~/.claude/stats-cache.json")
state_file = os.path.expanduser("$STATE_FILE")
api_key = "$API_KEY"
api_url = "$API_URL"

with open(stats_file) as f:
    current = json.load(f)

prev = {}
if os.path.exists(state_file):
    with open(state_file) as f:
        prev = json.load(f)

prev_usage = prev.get("modelUsage", {})
curr_usage = current.get("modelUsage", {})

import urllib.request

today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

for model, data in curr_usage.items():
    prev_data = prev_usage.get(model, {})
    diff_input = data.get("inputTokens", 0) - prev_data.get("inputTokens", 0)
    diff_output = data.get("outputTokens", 0) - prev_data.get("outputTokens", 0)
    diff_cache = data.get("cacheReadInputTokens", 0) - prev_data.get("cacheReadInputTokens", 0)
    diff_cost = data.get("costUSD", 0) - prev_data.get("costUSD", 0)

    if diff_input <= 0 and diff_output <= 0:
        continue

    payload = json.dumps({
        "model": model,
        "inputTokens": max(0, diff_input),
        "outputTokens": max(0, diff_output),
        "cacheReadTokens": max(0, diff_cache),
        "costUSD": max(0, diff_cost),
        "date": today,
        "projectName": "default"
    }).encode()

    req = urllib.request.Request(
        api_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST"
    )
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"Error sending {model}: {e}", file=sys.stderr)

with open(state_file, "w") as f:
    json.dump(current, f)

print("ClaudeTrack: synced usage data")
PYEOF
SCRIPT

chmod +x "$TRACKER_SCRIPT"

# cron 등록 (*/5 * * * *)
CRON_JOB="*/5 * * * * $TRACKER_SCRIPT >> $STATE_DIR/tracker.log 2>&1"
(crontab -l 2>/dev/null || true) | grep -v "claudetrack\|tracker.sh" | { cat; echo "$CRON_JOB"; } | crontab -

echo ""
echo "ClaudeTrack tracker installed!"
echo "  Config: $CONFIG_FILE"
echo "  Cron: every 5 minutes"
echo "  Logs: $STATE_DIR/tracker.log"
echo ""
echo "Usage data will appear in your dashboard within 5 minutes."
echo "Dashboard: https://claudetrack.qucord.com/dashboard"
