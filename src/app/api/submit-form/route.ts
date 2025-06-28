import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface FormSubmission {
  // Main choice
  mainChoice: string; // 'website', 'webapp', 'custom'
  
  // Website specific
  websiteType: string; // 'simple', 'ecommerce', 'complex'
  
  // Web App specific
  appPlatform: string; // 'mobile', 'web', 'both'
  appDescription: string;
  
  // Custom code specific
  customDescription: string;
  customTemplate: string;
  
  // Common fields
  budget: string;
  timeline: string;
  existingPresence: string;
  inspiration: string;
  preferredPlatform: string;
  
  // Contact info
  name: string;
  email: string;
  phone: string;
}

// Map form values to readable labels
const MAIN_CHOICE_LABELS = {
  website: "Website",
  webapp: "Web Application", 
  custom: "Custom Code/Automation"
};

const WEBSITE_TYPE_LABELS = {
  simple: "Simple Informational Site ($350–$600+, ~7 days)",
  ecommerce: "Online Store ($500–$1,200+, ~7 days)",
  complex: "Complex Website ($500–$1,000+, ~14 days)"
};

const APP_PLATFORM_LABELS = {
  mobile: "Mobile App (iOS & Android)",
  web: "Web App (Browser-based)",
  both: "Both Mobile + Web"
};

const CUSTOM_TEMPLATE_LABELS = {
  crm: "CRM Sync",
  zapier: "Zapier Workflow",
  email: "Email Drip Campaign",
  integration: "Custom Integration",
  other: "Something Else"
};

const TIMELINE_LABELS = {
  asap: "ASAP (1-2 weeks)",
  fast: "Fast Track (2-4 weeks)",
  standard: "Standard (1-2 months)",
  flexible: "Flexible (2+ months)"
};

const EXISTING_PRESENCE_LABELS = {
  none: "No - Starting fresh",
  yes: "Yes - Has existing online presence"
};

const PLATFORM_PREFERENCE_LABELS = {
  nextjs: "Next.js - Modern, fast, developer-friendly",
  wix: "Wix - Easy to edit yourself later",
  shopify: "Shopify - Best for e-commerce",
  wordpress: "WordPress - Most popular CMS",
  "no-preference": "No Preference - You choose what's best"
};

const BUDGET_LABELS = {
  // Web App budgets
  under1k: "Under $1K",
  "5k": "Around $5K",
  "10k": "Around $10K",
  over20k: "Over $20K",
  // Custom budgets
  under500: "Under $500",
  "1k": "Around $1K",
  over10k: "Over $10K"
};

export async function POST(request: NextRequest) {
  try {
    const formData: FormSubmission = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.mainChoice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for HubSpot API key
    const hubspotApiKey = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!hubspotApiKey) {
      console.error('HubSpot API key not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate and format phone number
    let formattedPhone = "";
    if (formData.phone) {
      // Remove all non-digit characters and format as (XXX) XXX-XXXX
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length === 10) {
        formattedPhone = `(${phoneDigits.slice(0,3)}) ${phoneDigits.slice(3,6)}-${phoneDigits.slice(6)}`;
      } else if (phoneDigits.length === 11 && phoneDigits[0] === '1') {
        formattedPhone = `+1 (${phoneDigits.slice(1,4)}) ${phoneDigits.slice(4,7)}-${phoneDigits.slice(7)}`;
      } else {
        formattedPhone = formData.phone; // Keep original if can't format
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate name (only letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(formData.name)) {
      return NextResponse.json(
        { error: 'Name should only contain letters, spaces, hyphens, and apostrophes' },
        { status: 400 }
      );
    }

    // Prepare readable values
    const serviceType = MAIN_CHOICE_LABELS[formData.mainChoice as keyof typeof MAIN_CHOICE_LABELS] || formData.mainChoice;
    
    let subType = "";
    let projectDescription = "";
    
    // Build sub-type and description based on main choice
    if (formData.mainChoice === 'website') {
      subType = WEBSITE_TYPE_LABELS[formData.websiteType as keyof typeof WEBSITE_TYPE_LABELS] || formData.websiteType;
      projectDescription = `Website: ${subType}`;
      if (formData.preferredPlatform) {
        const platformLabel = PLATFORM_PREFERENCE_LABELS[formData.preferredPlatform as keyof typeof PLATFORM_PREFERENCE_LABELS] || formData.preferredPlatform;
        projectDescription += `\nPreferred Platform: ${platformLabel}`;
      }
    } else if (formData.mainChoice === 'webapp') {
      subType = APP_PLATFORM_LABELS[formData.appPlatform as keyof typeof APP_PLATFORM_LABELS] || formData.appPlatform;
      projectDescription = `Web App: ${formData.appDescription}`;
      if (formData.appPlatform) {
        projectDescription += `\nPlatform: ${subType}`;
      }
    } else if (formData.mainChoice === 'custom') {
      if (formData.customTemplate && formData.customTemplate !== 'other') {
        subType = CUSTOM_TEMPLATE_LABELS[formData.customTemplate as keyof typeof CUSTOM_TEMPLATE_LABELS] || formData.customTemplate;
      }
      projectDescription = formData.customDescription || "Custom automation/code project";
      if (subType) {
        projectDescription = `${subType}: ${projectDescription}`;
      }
    }

    let budgetLabel = BUDGET_LABELS[formData.budget as keyof typeof BUDGET_LABELS] || formData.budget;
    if (formData.mainChoice === 'website' && !formData.budget) {
      budgetLabel = ""; // Budget not collected for website path, send empty string
    }

    let timelineLabel = TIMELINE_LABELS[formData.timeline as keyof typeof TIMELINE_LABELS] || formData.timeline;
    if (formData.mainChoice === 'webapp' && !formData.timeline) {
      timelineLabel = ""; // Timeline not collected for webapp path, send empty string
    }
    
    const existingPresenceLabel = EXISTING_PRESENCE_LABELS[formData.existingPresence as keyof typeof EXISTING_PRESENCE_LABELS] || formData.existingPresence;

    // Calculate qualification score (1-10 based on budget and complexity)
    let qualificationScore = 5; // Default
    
    if (formData.mainChoice === 'webapp') {
      if (formData.budget === 'over20k') qualificationScore = 10;
      else if (formData.budget === '10k') qualificationScore = 8;
      else if (formData.budget === '5k') qualificationScore = 6;
      else qualificationScore = 4;
    } else if (formData.mainChoice === 'website') {
      if (formData.websiteType === 'complex') qualificationScore = 7;
      else if (formData.websiteType === 'ecommerce') qualificationScore = 6;
      else qualificationScore = 5;
    } else if (formData.mainChoice === 'custom') {
      if (formData.budget === 'over10k') qualificationScore = 9;
      else if (formData.budget === '5k') qualificationScore = 7;
      else if (formData.budget === '1k') qualificationScore = 5;
      else qualificationScore = 3;
    }

    // Split full name into first and last name for HubSpot
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare project details for notes
    const projectNotes = [
      `🚀 PROJECT DETAILS`,
      `Service: ${serviceType}`,
      subType ? `Type: ${subType}` : '',
      projectDescription ? `Description: ${projectDescription}` : '',
      budgetLabel ? `Budget: ${budgetLabel}` : '',
      timelineLabel ? `Timeline: ${timelineLabel}` : '',
      existingPresenceLabel ? `Existing Presence: ${existingPresenceLabel}` : '',
      formData.inspiration ? `Inspiration/Links: ${formData.inspiration}` : '',
      `Qualification Score: ${qualificationScore}/10`,
      `Form Submitted: ${new Date().toLocaleString()}`
    ].filter(Boolean).join('\n');

    // Prepare contact properties for HubSpot
    const contactProperties = {
      email: formData.email,
      firstname: firstName,
      lastname: lastName,
      phone: formattedPhone,
      company: serviceType, // Keep service type in company for easy categorization
      website: formData.inspiration || "", // Keep inspiration in website field as backup
      lifecyclestage: "lead",
      
      // Custom properties (create these in HubSpot first)
      project_service_type: serviceType,
      project_sub_type: subType,
      project_budget: budgetLabel,
      project_timeline: timelineLabel,
      existing_presence: existingPresenceLabel,
      project_description: projectDescription,
      inspiration_links: formData.inspiration || "",
      qualification_score: qualificationScore,
      lead_status: "New",
      
      // Fallback: Also store in job title in case custom properties fail
      jobtitle: `Score: ${qualificationScore}/10 | ${budgetLabel || 'Budget TBD'}`,
      
      // Store full details in message field as backup
      message: projectNotes
    };

    // Create contact in HubSpot using v3 API
    const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotApiKey}`
      },
      body: JSON.stringify({
        properties: contactProperties
      })
    });

    const hubspotResult = await hubspotResponse.json();

    if (!hubspotResponse.ok) {
      console.error('HubSpot API error:', hubspotResult);
      
      // Handle duplicate contact (email already exists)
      if (hubspotResult.category === 'CONFLICT') {
        // Try to update existing contact instead
        const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${formData.email}?idProperty=email`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hubspotApiKey}`
          },
          body: JSON.stringify({
            properties: contactProperties
          })
        });

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          return NextResponse.json({
            success: true,
            message: 'Contact updated successfully',
            hubspotContactId: updateResult.id,
            qualificationScore: qualificationScore,
            action: 'updated'
          });
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to submit to CRM', details: hubspotResult },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact created successfully',
      hubspotContactId: hubspotResult.id,
      qualificationScore: qualificationScore,
      action: 'created'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
