"""
Claude API Usage Report
-----------------------
Get a clear usage report from your Anthropic account.

Requirements:
    pip install requests

Setup:
    Set your ADMIN API key (not regular API key!)
    Get it from: https://console.anthropic.com/settings/admin-keys
"""

import requests
from datetime import datetime, timedelta
from collections import defaultdict

# ============================================================
# CONFIGURATION - Set your Admin API key here
# ============================================================
ADMIN_API_KEY ="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"

# Date range (default: last 30 days)
DAYS_BACK = 30

# ============================================================

def get_usage_report(starting_at: str, ending_at: str, group_by: list = None):
    """Fetch usage data from Anthropic API."""
    
    url = "https://api.anthropic.com/v1/organizations/usage_report/messages"
    
    headers = {
        "anthropic-version": "2023-06-01",
        "x-api-key": ADMIN_API_KEY,
    }
    
    params = {
        "starting_at": starting_at,
        "ending_at": ending_at,
        "bucket_width": "1d",  # Daily buckets
    }
    
    if group_by:
        for field in group_by:
            params[f"group_by[]"] = field
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return None
    
    return response.json()


def format_tokens(count: int) -> str:
    """Format token count with commas and K/M suffix."""
    if count >= 1_000_000:
        return f"{count/1_000_000:.2f}M"
    elif count >= 1_000:
        return f"{count/1_000:.1f}K"
    return str(count)


def calculate_cost(input_tokens: int, output_tokens: int, model: str) -> float:
    """Calculate estimated cost based on model pricing."""
    
    # Pricing per million tokens (as of late 2025)
    pricing = {
        "claude-opus-4-5": {"input": 5.00, "output": 25.00},
        "claude-sonnet-4-5": {"input": 3.00, "output": 15.00},
        "claude-sonnet-4": {"input": 3.00, "output": 15.00},
        "claude-haiku-4-5": {"input": 0.80, "output": 4.00},
        "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
        "claude-3-opus": {"input": 15.00, "output": 75.00},
        "claude-3-sonnet": {"input": 3.00, "output": 15.00},
        "claude-3-haiku": {"input": 0.25, "output": 1.25},
    }
    
    # Find matching model pricing
    model_key = None
    for key in pricing:
        if key in model.lower():
            model_key = key
            break
    
    if not model_key:
        # Default to Sonnet pricing if unknown
        model_key = "claude-sonnet-4-5"
    
    rates = pricing[model_key]
    input_cost = (input_tokens / 1_000_000) * rates["input"]
    output_cost = (output_tokens / 1_000_000) * rates["output"]
    
    return input_cost + output_cost


def print_usage_report():
    """Print a clear, formatted usage report."""
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=DAYS_BACK)
    
    starting_at = start_date.strftime("%Y-%m-%dT00:00:00Z")
    ending_at = end_date.strftime("%Y-%m-%dT23:59:59Z")
    
    print("=" * 60)
    print("           CLAUDE API USAGE REPORT")
    print("=" * 60)
    print(f"Period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
    print(f"Days: {DAYS_BACK}")
    print("=" * 60)
    
    # Fetch data grouped by model
    data = get_usage_report(starting_at, ending_at, group_by=["model"])
    
    if not data:
        print("Failed to fetch usage data.")
        print("\nTroubleshooting:")
        print("1. Make sure you're using an ADMIN API key (sk-ant-admin-...)")
        print("2. Check if your key has the right permissions")
        print("3. Get admin key from: https://console.anthropic.com/settings/admin-keys")
        return
    
    # Process and aggregate data
    model_stats = defaultdict(lambda: {
        "input_tokens": 0,
        "output_tokens": 0,
        "cached_input": 0,
        "cache_creation": 0,
    })
    
    total_input = 0
    total_output = 0
    total_cached = 0
    
    buckets = data.get("buckets", [])
    
    for bucket in buckets:
        model = bucket.get("model", "unknown")
        
        input_tokens = bucket.get("input_tokens", 0)
        output_tokens = bucket.get("output_tokens", 0)
        cached_input = bucket.get("cached_input_tokens", 0)
        cache_creation = bucket.get("cache_creation_input_tokens", 0)
        
        model_stats[model]["input_tokens"] += input_tokens
        model_stats[model]["output_tokens"] += output_tokens
        model_stats[model]["cached_input"] += cached_input
        model_stats[model]["cache_creation"] += cache_creation
        
        total_input += input_tokens
        total_output += output_tokens
        total_cached += cached_input
    
    # Print per-model breakdown
    print("\n📊 USAGE BY MODEL")
    print("-" * 60)
    
    total_cost = 0
    
    for model, stats in sorted(model_stats.items()):
        cost = calculate_cost(stats["input_tokens"], stats["output_tokens"], model)
        total_cost += cost
        
        print(f"\n🤖 {model}")
        print(f"   Input tokens:    {format_tokens(stats['input_tokens']):>12}")
        print(f"   Output tokens:   {format_tokens(stats['output_tokens']):>12}")
        if stats["cached_input"] > 0:
            print(f"   Cached input:    {format_tokens(stats['cached_input']):>12}")
        if stats["cache_creation"] > 0:
            print(f"   Cache creation:  {format_tokens(stats['cache_creation']):>12}")
        print(f"   Est. cost:       ${cost:>11.2f}")
    
    # Print totals
    print("\n" + "=" * 60)
    print("📈 TOTALS")
    print("=" * 60)
    print(f"   Total input tokens:   {format_tokens(total_input):>12}")
    print(f"   Total output tokens:  {format_tokens(total_output):>12}")
    if total_cached > 0:
        print(f"   Total cached:         {format_tokens(total_cached):>12}")
    print("-" * 60)
    print(f"   💰 ESTIMATED TOTAL COST:  ${total_cost:>10.2f}")
    print("=" * 60)
    
    # Note about estimates
    print("\n⚠️  Note: Costs are estimates based on standard pricing.")
    print("   Actual billing may differ (caching discounts, etc.)")
    print("   Check console.anthropic.com for official billing.")


if __name__ == "__main__":
    print()
    
    if ADMIN_API_KEY == "sk-ant-admin-xxxxx":
        print("⚠️  Please set your ADMIN_API_KEY in the script!")
        print()
        print("To get an Admin API key:")
        print("1. Go to https://console.anthropic.com")
        print("2. Navigate to Settings → Admin Keys")
        print("3. Create a new Admin API key")
        print("4. Paste it in this script")
        print()
    else:
        print_usage_report()