# HubSpot CRM Integration Setup

This guide will help you set up the HubSpot integration for your form submissions.

## Step 1: Get Your HubSpot Access Token

### Option A: Private App (Recommended for production)
1. Go to your HubSpot account
2. Navigate to Settings → Integrations → Private Apps
3. Click "Create a private app"
4. Give it a name like "Zero Point Labs Form Integration"
5. Go to the "Scopes" tab and enable:
   - `crm.objects.contacts.write` (Create contacts)
   - `crm.objects.contacts.read` (Read contacts for updates)
6. Click "Create app"
7. Copy the access token (it will look like: `pat-na1-...`)

### Option B: API Key (Legacy, not recommended)
1. Go to Settings → Integrations → API Key
2. Generate your API key
3. Copy the key

## Step 2: Set Up Your Environment Variables

Add these to your `.env.local` file:

```bash
# HubSpot Integration Configuration
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
```

## Step 3: Set Up Custom Properties in HubSpot (Optional but Recommended)

To get the most out of the integration, create these custom contact properties in HubSpot:

1. Go to Settings → Properties → Contact properties
2. Create the following custom properties:

### Project Details Properties
- **Property Name**: `project_service_type`
  - **Label**: "Project Service Type"
  - **Field Type**: Single-line text
  - **Description**: "Type of service requested (Website, Web App, Custom Code)"

- **Property Name**: `project_sub_type`
  - **Label**: "Project Sub Type"
  - **Field Type**: Single-line text
  - **Description**: "Specific type of project"

- **Property Name**: `project_budget`
  - **Label**: "Project Budget"
  - **Field Type**: Single-line text
  - **Description**: "Budget range for the project"

- **Property Name**: `project_timeline`
  - **Label**: "Project Timeline"
  - **Field Type**: Single-line text
  - **Description**: "Desired timeline for project completion"

- **Property Name**: `existing_presence`
  - **Label**: "Existing Online Presence"
  - **Field Type**: Single-line text
  - **Description**: "Whether client has existing website/social media"

- **Property Name**: `project_description`
  - **Label**: "Project Description"
  - **Field Type**: Multi-line text
  - **Description**: "Detailed project description and requirements"

- **Property Name**: `inspiration_links`
  - **Label**: "Inspiration Links"
  - **Field Type**: Multi-line text
  - **Description**: "Links to websites/apps for inspiration"

- **Property Name**: `qualification_score`
  - **Label**: "Qualification Score"
  - **Field Type**: Number
  - **Description**: "Auto-calculated lead qualification score (1-10)"

## Step 4: How the Integration Works

### What Happens When Someone Submits the Form:

1. **Contact Creation/Update**: 
   - Creates a new contact in HubSpot with email as unique identifier
   - If contact exists, updates their information
   - Automatically splits full name into first/last name

2. **Standard Properties Populated**:
   - Email address
   - First name & Last name
   - Phone number (formatted)
   - Company (set to service type for categorization)
   - Lifecycle stage (set to "lead")

3. **Custom Properties Populated**:
   - All project details captured in custom fields
   - Qualification score calculated based on budget/complexity
   - Project description with all relevant details

4. **Lead Status Tracking**:
   - New contacts: `hs_lead_status` = "NEW"
   - Updated contacts: `hs_lead_status` = "EXISTING_UPDATED"

## Step 5: Data Structure

### Form Data Captured:
- **Service Type**: Website, Web Application, or Custom Code
- **Project Details**: Specific requirements based on service type
- **Budget**: Range based on service complexity
- **Timeline**: When they need it completed
- **Existing Presence**: Current websites/social media
- **Inspiration**: References for design/functionality
- **Contact Info**: Name, email, phone

### Qualification Scoring:
- **Web Apps**: 4-10 points (based on budget: Under $1K = 4, Over $20K = 10)
- **Websites**: 5-7 points (Simple = 5, Complex = 7)
- **Custom Code**: 3-9 points (Under $500 = 3, Over $10K = 9)

## Step 6: Testing the Integration

1. Submit a test form on your website
2. Check your HubSpot Contacts to see the new contact
3. Verify all custom properties are populated
4. Test with an existing email to see update functionality

## Step 7: HubSpot Workflows (Optional)

Set up automated workflows in HubSpot based on the qualification score:

- **High Priority (8-10 points)**: Immediate sales notification
- **Medium Priority (5-7 points)**: Add to nurture sequence
- **Low Priority (1-4 points)**: Add to long-term follow-up list

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check your access token and scopes
2. **404 Not Found**: Verify the API endpoint URL
3. **Custom properties not showing**: Make sure you created them in HubSpot first
4. **Duplicate contacts**: The system handles this automatically by updating existing contacts

### API Rate Limits:
- HubSpot Free: 100 requests per 10 seconds
- Paid tiers: Higher limits based on subscription

## Benefits of HubSpot Integration

✅ **Professional CRM**: Industry-leading contact management  
✅ **Automatic Lead Scoring**: Built-in qualification scoring  
✅ **Workflow Automation**: Trigger actions based on form submissions  
✅ **Email Integration**: Connect with HubSpot's email marketing tools  
✅ **Sales Pipeline**: Track leads through your sales process  
✅ **Reporting**: Detailed analytics on form submissions and conversions  

Your form is now fully integrated with HubSpot CRM! 🎉 