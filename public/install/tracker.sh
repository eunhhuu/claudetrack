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

cat > "$CONFIG_FILE" <<CONF
{"api_key":"$API_KEY","api_url":"$API_URL"}
CONF

cat > "$TRACKER_SCRIPT" <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

STATE_DIR="$HOME/.claudetrack"
CONFIG_FILE="$STATE_DIR/config.json"
STATE_FILE="$STATE_DIR/last_state.json"
STATS_FILE="$HOME/.claude/stats-cache.json"

if [ ! -f "$CONFIG_FILE" ]; then
  exit 0
fi

API_KEY=$(python3 -c "import json,sys;print(json.load(open('$CONFIG_FILE'))['api_key'])" 2>/dev/null || echo "")
API_URL=$(python3 -c "import json,sys;print(json.load(open('$CONFIG_FILE'))['api_url'])" 2>/dev/null || echo "")

if [ -z "$API_KEY" ] || [ -z "$API_URL" ]; then
  exit 0
fi

if [ ! -f "$STATS_FILE" ]; then
  exit 0
fi

CURRENT=$(cat "$STATS_FILE")

if [ -f "$STATE_FILE" ]; then
  PREVIOUS=$(cat "$STATE_FILE")
else
  PREVIOUS="{}"
fi

python3 -c "
import json, sys, urllib.request, datetime

current = json.loads('''$CURRENT''')
previous = json.loads('''$PREVIOUS''')

api_key = '$API_KEY'
api_url = '$API_URL'

prev_usage = previous.get('modelUsage', {})
curr_usage = current.get('modelUsage', {})

today = datetime.date.today().isoformat()

for model, data in curr_usage.items():
    prev = prev_usage.get(model, {})
    input_diff = data.get('inputTokens', 0) - prev.get('inputTokens', 0)
    output_diff = data.get('outputTokens', 0) - prev.get('outputTokens', 0)
    cost_diff = data.get('costUSD', 0) - prev.get('costUSD', 0)

    if input_diff <= 0 and output_diff <= 0:
        continue

    payload = json.dumps({
        'model': model,
        'inputTokens': max(0, input_diff),
        'outputTokens': max(0, output_diff),
        'cacheReadTokens': max(0, data.get('cacheReadInputTokens', 0) - prev.get('cacheReadInputTokens', 0)),
        'costUSD': round(max(0, cost_diff), 6),
        'date': today,
        'projectName': 'default'
    }).encode()

    req = urllib.request.Request(
        api_url,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        },
        method='POST'
    )
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass
" 2>/dev/null || true

cp "$STATS_FILE" "$STATE_FILE"
SCRIPT

chmod +x "$TRACKER_SCRIPT"

CRON_CMD="*/5 * * * * $TRACKER_SCRIPT"
(crontab -l 2>/dev/null | grep -v "$TRACKER_SCRIPT"; echo "$CRON_CMD") | crontab -

echo ""
echo "✓ ClaudeTrack tracker installed!"
echo "  Config: $CONFIG_FILE"
echo "  Script: $TRACKER_SCRIPT"
echo "  Cron:   every 5 minutes"
echo ""
echo "  Your usage data will appear on your dashboard shortly."
echo ""
