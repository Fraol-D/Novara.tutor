// Vercel Serverless Function for Contact Form
// Deploy to Vercel and this will automatically work at /api/contact

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).json({})
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    const { name, email, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'NovaraTutor <onboarding@resend.dev>', // Update with your verified domain
          to: process.env.CONTACT_EMAIL || 'contact@novaratutor.com',
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #008080;">New Contact Form Submission</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #666; font-size: 12px;">
                Received: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        })
        
        console.log('✅ Email sent successfully via Resend')
      } catch (emailError) {
        console.error('❌ Resend error:', emailError)
        // Continue anyway to not block the user
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured - logging submission only')
    }

    // Log to console (visible in Vercel logs)
    console.log('📧 Contact form submission:', { 
      name, 
      email, 
      message: message.substring(0, 100), 
      timestamp: new Date().toISOString() 
    })

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for reaching out! We\'ll get back to you soon.' 
    })
  } catch (error) {
    console.error('💥 Contact form error:', error)
    return res.status(500).json({ 
      error: 'Failed to process your request. Please try again later.' 
    })
  }
}
