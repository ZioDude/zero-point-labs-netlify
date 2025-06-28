#!/bin/bash

# Client Management Script for Zero Point Labs Dashboard
# Usage: ./scripts/manage-clients.sh [command] [options]

DB_NAME="zero-point-labs-dashboard"

show_help() {
    echo "Zero Point Labs Dashboard - Client Management"
    echo "============================================"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list                    List all clients"
    echo "  add [name] [email] [website] [code]  Add new client"
    echo "  deactivate [code]       Deactivate a client"
    echo "  activate [code]         Activate a client"
    echo "  delete [code]           Delete a client (WARNING: permanent)"
    echo "  reset-sessions [code]   Clear all sessions for a client"
    echo "  stats [code]            Show statistics for a client"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 add \"Acme Corp\" \"admin@acme.com\" \"https://acme.com\" \"ACME2024\""
    echo "  $0 stats SPARKLE2024"
    echo "  $0 reset-sessions DEMO2024"
}

generate_client_id() {
    echo "client-$(date +%s)$(shuf -i 100-999 -n 1)"
}

list_clients() {
    echo "📋 Current Clients:"
    echo "==================="
    wrangler d1 execute $DB_NAME --command="
        SELECT 
            client_code,
            name,
            email,
            website_url,
            CASE WHEN is_active = 1 THEN '✅ Active' ELSE '❌ Inactive' END as status,
            created_at
        FROM clients 
        ORDER BY created_at DESC;
    " --json | jq -r '.[] | "\(.client_code) | \(.name) | \(.email) | \(.status)"'
}

add_client() {
    local name="$1"
    local email="$2"
    local website="$3"
    local code="$4"
    
    if [[ -z "$name" || -z "$email" || -z "$code" ]]; then
        echo "❌ Error: Missing required fields"
        echo "Usage: $0 add \"Client Name\" \"email@domain.com\" \"https://website.com\" \"CLIENTCODE\""
        return 1
    fi
    
    local client_id=$(generate_client_id)
    
    echo "Adding new client..."
    echo "Name: $name"
    echo "Email: $email"
    echo "Website: $website"
    echo "Code: $code"
    echo "ID: $client_id"
    
    wrangler d1 execute $DB_NAME --command="
        INSERT INTO clients (id, name, email, website_url, client_code, is_active, created_at, updated_at)
        VALUES (
            '$client_id',
            '$name',
            '$email',
            '${website:-NULL}',
            '$code',
            1,
            datetime('now'),
            datetime('now')
        );
    "
    
    if [ $? -eq 0 ]; then
        echo "✅ Client added successfully!"
        echo "🔑 Client Code: $code"
        echo "🌐 Login URL: https://your-domain.com/login"
    else
        echo "❌ Failed to add client. Code might already exist."
    fi
}

deactivate_client() {
    local code="$1"
    
    if [[ -z "$code" ]]; then
        echo "❌ Error: Client code required"
        echo "Usage: $0 deactivate CLIENT_CODE"
        return 1
    fi
    
    wrangler d1 execute $DB_NAME --command="
        UPDATE clients 
        SET is_active = 0, updated_at = datetime('now')
        WHERE client_code = '$code';
    "
    
    echo "✅ Client $code has been deactivated"
}

activate_client() {
    local code="$1"
    
    if [[ -z "$code" ]]; then
        echo "❌ Error: Client code required"
        echo "Usage: $0 activate CLIENT_CODE"
        return 1
    fi
    
    wrangler d1 execute $DB_NAME --command="
        UPDATE clients 
        SET is_active = 1, updated_at = datetime('now')
        WHERE client_code = '$code';
    "
    
    echo "✅ Client $code has been activated"
}

delete_client() {
    local code="$1"
    
    if [[ -z "$code" ]]; then
        echo "❌ Error: Client code required"
        echo "Usage: $0 delete CLIENT_CODE"
        return 1
    fi
    
    echo "⚠️  WARNING: This will permanently delete all data for client $code"
    echo "This includes:"
    echo "- Client record"
    echo "- All sessions"
    echo "- All form submissions"
    echo "- All analytics data"
    echo ""
    read -p "Are you sure? Type 'DELETE' to confirm: " confirmation
    
    if [[ "$confirmation" != "DELETE" ]]; then
        echo "❌ Deletion cancelled"
        return 1
    fi
    
    # Get client ID first
    client_id=$(wrangler d1 execute $DB_NAME --command="SELECT id FROM clients WHERE client_code = '$code';" --json | jq -r '.[0].id // empty')
    
    if [[ -z "$client_id" ]]; then
        echo "❌ Client not found"
        return 1
    fi
    
    # Delete in order (respecting foreign keys)
    wrangler d1 execute $DB_NAME --command="DELETE FROM page_views WHERE client_id = '$client_id';"
    wrangler d1 execute $DB_NAME --command="DELETE FROM visitor_sessions WHERE client_id = '$client_id';"
    wrangler d1 execute $DB_NAME --command="DELETE FROM analytics_data WHERE client_id = '$client_id';"
    wrangler d1 execute $DB_NAME --command="DELETE FROM form_submissions WHERE client_id = '$client_id';"
    wrangler d1 execute $DB_NAME --command="DELETE FROM client_sessions WHERE client_id = '$client_id';"
    wrangler d1 execute $DB_NAME --command="DELETE FROM clients WHERE id = '$client_id';"
    
    echo "✅ Client $code and all associated data has been deleted"
}

reset_sessions() {
    local code="$1"
    
    if [[ -z "$code" ]]; then
        echo "❌ Error: Client code required"
        echo "Usage: $0 reset-sessions CLIENT_CODE"
        return 1
    fi
    
    # Get client ID
    client_id=$(wrangler d1 execute $DB_NAME --command="SELECT id FROM clients WHERE client_code = '$code';" --json | jq -r '.[0].id // empty')
    
    if [[ -z "$client_id" ]]; then
        echo "❌ Client not found"
        return 1
    fi
    
    wrangler d1 execute $DB_NAME --command="DELETE FROM client_sessions WHERE client_id = '$client_id';"
    
    echo "✅ All sessions for client $code have been cleared"
}

show_stats() {
    local code="$1"
    
    if [[ -z "$code" ]]; then
        echo "❌ Error: Client code required"
        echo "Usage: $0 stats CLIENT_CODE"
        return 1
    fi
    
    # Get client info
    client_info=$(wrangler d1 execute $DB_NAME --command="
        SELECT name, email, website_url, created_at, is_active 
        FROM clients 
        WHERE client_code = '$code';
    " --json)
    
    if [[ "$client_info" == "[]" ]]; then
        echo "❌ Client not found"
        return 1
    fi
    
    echo "📊 Statistics for Client: $code"
    echo "================================"
    echo "$client_info" | jq -r '.[0] | "Name: \(.name)\nEmail: \(.email)\nWebsite: \(.website_url // "Not set")\nStatus: \(if .is_active == 1 then "Active" else "Inactive" end)\nCreated: \(.created_at)"'
    echo ""
    
    # Get client ID for stats
    client_id=$(echo "$client_info" | jq -r '.[0].id')
    
    # Get statistics
    stats=$(wrangler d1 execute $DB_NAME --command="
        SELECT 
            (SELECT COUNT(*) FROM client_sessions WHERE client_id = '$client_id') as sessions,
            (SELECT COUNT(*) FROM form_submissions WHERE client_id = '$client_id') as submissions,
            (SELECT COUNT(*) FROM analytics_data WHERE client_id = '$client_id') as analytics_days,
            (SELECT SUM(visitors_count) FROM analytics_data WHERE client_id = '$client_id') as total_visitors,
            (SELECT SUM(page_views_count) FROM analytics_data WHERE client_id = '$client_id') as total_page_views;
    " --json)
    
    echo "📈 Data Summary:"
    echo "$stats" | jq -r '.[0] | "Active Sessions: \(.sessions // 0)\nForm Submissions: \(.submissions // 0)\nAnalytics Days: \(.analytics_days // 0)\nTotal Visitors: \(.total_visitors // 0)\nTotal Page Views: \(.total_page_views // 0)"'
}

# Main script logic
case "$1" in
    "list")
        list_clients
        ;;
    "add")
        add_client "$2" "$3" "$4" "$5"
        ;;
    "deactivate")
        deactivate_client "$2"
        ;;
    "activate")
        activate_client "$2"
        ;;
    "delete")
        delete_client "$2"
        ;;
    "reset-sessions")
        reset_sessions "$2"
        ;;
    "stats")
        show_stats "$2"
        ;;
    *)
        show_help
        ;;
esac 