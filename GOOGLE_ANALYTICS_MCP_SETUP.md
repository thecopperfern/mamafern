# Google Analytics MCP Server Setup — Claude Code

This guide sets up the Google Analytics MCP server so Claude Code can query GA4 data directly (view reports, analyze traffic, check conversions, etc.)

---

## Prerequisites

### 1. Check if pipx is installed

```bash
pipx --version
```

If not installed:
- **Windows:** `python -m pip install --user pipx`
- **Mac/Linux:** `brew install pipx` or `python3 -m pip install --user pipx`

After install: `pipx ensurepath` (restart terminal)

---

## Step 1: Google Cloud Setup

### A. Create/Select Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. **Copy your Project ID** — you'll need this later

### B. Enable Required APIs

1. Go to [APIs & Services > Enable APIs and Services](https://console.cloud.google.com/apis/library)
2. Search and enable:
   - **Google Analytics Admin API**
   - **Google Analytics Data API (GA4)**

### C. Create OAuth Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **Internal** (if Workspace) or **External**
   - App name: **Claude Analytics MCP**
   - User support email: Your email
   - Developer contact: Your email
   - Add scope: `https://www.googleapis.com/auth/analytics.readonly`
4. Create OAuth client:
   - Application type: **Desktop app**
   - Name: **Claude Analytics MCP Client**
5. Click **Create** → **Download JSON**
6. Save as `analytics-credentials.json` in a safe location (e.g., `C:\Users\civen\.config\gcloud\`)

---

## Step 2: Authenticate with Google Cloud

### Option A: Using gcloud CLI (Recommended)

```bash
# Install gcloud CLI if needed
# https://cloud.google.com/sdk/docs/install

# Authenticate with analytics scope
gcloud auth application-default login \
  --scopes https://www.googleapis.com/auth/analytics.readonly
```

This creates credentials at:
- **Windows:** `%APPDATA%\gcloud\application_default_credentials.json`
- **Mac/Linux:** `~/.config/gcloud/application_default_credentials.json`

### Option B: Manual OAuth Flow

If you don't want gcloud CLI:

1. Install the MCP server first: `pipx install analytics-mcp`
2. Run it directly to trigger OAuth flow: `pipx run analytics-mcp`
3. It will open a browser for authentication
4. Grant access to your GA4 properties
5. Credentials will be saved automatically

---

## Step 3: Add MCP Server to Claude Code

### Find your credentials path

**Windows:**
```bash
echo %APPDATA%\gcloud\application_default_credentials.json
```

**Mac/Linux:**
```bash
echo ~/.config/gcloud/application_default_credentials.json
```

### Add the server

```bash
claude mcp add google-analytics \
  -e GOOGLE_APPLICATION_CREDENTIALS="C:\Users\civen\AppData\Roaming\gcloud\application_default_credentials.json" \
  -e GOOGLE_PROJECT_ID="your-project-id" \
  -- pipx run analytics-mcp
```

**Replace:**
- `GOOGLE_APPLICATION_CREDENTIALS` path with your actual path from above
- `your-project-id` with your Google Cloud Project ID

---

## Step 4: Verify It's Working

### Check MCP server status

```bash
claude mcp list
```

You should see:
```
google-analytics: pipx run analytics-mcp - ✓ Connected
```

### Test in Claude Code

Ask Claude:
> "What were my top 5 pages by pageviews in GA4 last week?"

Or:
> "Show me the conversion funnel from view_item to purchase"

Claude will now have access to these GA4 MCP tools:
- `list_accounts` — Get all GA4 accounts
- `list_properties` — Get all GA4 properties
- `run_report` — Query GA4 data (dimensions, metrics, date ranges)
- `run_realtime_report` — Get live GA4 data

---

## Troubleshooting

### "Authentication failed"
✅ Make sure you ran `gcloud auth application-default login` with the analytics scope
✅ Check that the credentials file exists at the path you specified
✅ Verify your Google account has access to the GA4 property

### "API not enabled"
✅ Go to Google Cloud Console → APIs & Services
✅ Enable both APIs: **Analytics Admin API** and **Analytics Data API (GA4)**

### "Property not found"
✅ Get your GA4 Property ID from [GA4 Admin](https://analytics.google.com/) → Admin → Property Settings
✅ Use the full property ID format: `properties/123456789`

### "pipx command not found"
✅ Install pipx: `python -m pip install --user pipx`
✅ Run `pipx ensurepath` and restart terminal
✅ Verify: `pipx --version`

---

## Example Queries

Once set up, you can ask Claude:

**Traffic Analysis:**
> "What are my top 10 traffic sources in GA4 this month?"

**E-commerce Funnel:**
> "Show me the add_to_cart → begin_checkout → purchase conversion rates"

**Real-time Data:**
> "How many active users are on my site right now?"

**Custom Reports:**
> "Compare pageviews between mobile and desktop for the last 30 days"

**Event Tracking:**
> "Show me all custom events and their counts from the past week"

---

## Security Notes

- The credentials file grants read-only access to GA4
- Never commit `application_default_credentials.json` to git
- Add to `.gitignore` if storing in project directory:
  ```
  **/application_default_credentials.json
  ```

---

## Removing the Server (if needed)

```bash
claude mcp remove google-analytics
```

---

## Additional Resources

- [Google Analytics MCP GitHub](https://github.com/googleanalytics/google-analytics-mcp)
- [GA4 Query API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Claude MCP Server Documentation](https://modelcontextprotocol.io/)
