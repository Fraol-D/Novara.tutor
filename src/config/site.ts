// Site configuration - Update with your actual info
export const siteConfig = {
  contact: {
    email: 'contact@novaratutor.com', // Replace with your email
    phone: '+1 (555) 123-4567', // Optional
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/109976188/admin/dashboard/',
    instagram: 'https://www.instagram.com/novaratutor/',
    x: 'https://x.com/novara_tutor',
  },
  // Email service configuration (uncomment and add your API key)
  email: {
    // For Resend (recommended - free tier available)
    // provider: 'resend',
    // apiKey: process.env.RESEND_API_KEY,
    
    // For SendGrid
    // provider: 'sendgrid',
    // apiKey: process.env.SENDGRID_API_KEY,
    
    // For Mailgun
    // provider: 'mailgun',
    // apiKey: process.env.MAILGUN_API_KEY,
    // domain: process.env.MAILGUN_DOMAIN,
  },
}
