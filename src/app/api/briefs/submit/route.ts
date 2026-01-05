/**
 * Brief Submission API Route
 * 
 * Handles brief form submissions.
 * POST /api/briefs/submit
 * 
 * - Validates required fields
 * - Inserts into Postgres briefs table
 * - Sends email notification to admin
 * - Sends confirmation email to client
 */

import { NextRequest, NextResponse } from 'next/server';
import { insertBrief, type NewBrief } from '@/lib/db';
import { sendAdminNotification, sendClientConfirmation } from '@/lib/email';

// Validation
const PROJECT_TYPES = ['Website', 'Web Application', 'Branding', 'SEO/GEO', 'Other'];
const BUDGET_RANGES = ['Under £1k', '£1k-£3k', '£3k-£5k', '£5k-£10k', '£10k+', 'Not sure'];
const TIMELINES = ['ASAP', '1-2 weeks', '1 month', '2-3 months', 'Flexible'];
const REFERRAL_SOURCES = ['Google', 'LinkedIn', 'Referral', 'Other'];

interface BriefSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  file_urls?: string[];
  referral_source?: string;
}

function validateSubmission(data: BriefSubmission): string[] {
  const errors: string[] = [];

  // Required fields
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Full name is required (minimum 2 characters)');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('A valid email address is required');
  }

  if (!data.project_type || !PROJECT_TYPES.includes(data.project_type)) {
    errors.push('Please select a valid project type');
  }

  if (!data.description || data.description.trim().length < 50) {
    errors.push('Project description is required (minimum 50 characters)');
  }

  // Optional field validation
  if (data.budget_range && !BUDGET_RANGES.includes(data.budget_range)) {
    errors.push('Invalid budget range selected');
  }

  if (data.timeline && !TIMELINES.includes(data.timeline)) {
    errors.push('Invalid timeline selected');
  }

  if (data.referral_source && !REFERRAL_SOURCES.includes(data.referral_source)) {
    errors.push('Invalid referral source selected');
  }

  // Sanitize file URLs
  if (data.file_urls) {
    const invalidUrls = data.file_urls.filter(
      (url) => !url.startsWith('https://') || !url.includes('blob.vercel-storage.com')
    );
    if (invalidUrls.length > 0) {
      errors.push('Invalid file URLs detected');
    }
  }

  return errors;
}

function sanitizeInput(str: string | undefined): string {
  if (!str) return '';
  // Basic sanitization - remove potential XSS
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Sanitize inputs
    const submission: BriefSubmission = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email)?.toLowerCase(),
      company: sanitizeInput(body.company) || undefined,
      phone: sanitizeInput(body.phone) || undefined,
      project_type: body.project_type,
      budget_range: body.budget_range || undefined,
      timeline: body.timeline || undefined,
      description: sanitizeInput(body.description),
      file_urls: Array.isArray(body.file_urls) ? body.file_urls : undefined,
      referral_source: body.referral_source || undefined,
    };

    // Validate
    const validationErrors = validateSubmission(submission);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Insert into database
    const brief: NewBrief = {
      name: submission.name,
      email: submission.email,
      company: submission.company,
      phone: submission.phone,
      project_type: submission.project_type,
      budget_range: submission.budget_range,
      timeline: submission.timeline,
      description: submission.description,
      file_urls: submission.file_urls,
      referral_source: submission.referral_source,
    };

    const insertedBrief = await insertBrief(brief);

    // Send emails (don't fail if emails fail)
    const emailData = {
      name: submission.name,
      email: submission.email,
      company: submission.company,
      phone: submission.phone,
      project_type: submission.project_type,
      budget_range: submission.budget_range,
      timeline: submission.timeline,
      description: submission.description,
      file_urls: submission.file_urls,
      referral_source: submission.referral_source,
    };

    // Send both emails in parallel
    const [adminSent, clientSent] = await Promise.all([
      sendAdminNotification(emailData),
      sendClientConfirmation(emailData),
    ]);

    if (!adminSent) {
      console.error('Failed to send admin notification email');
    }

    if (!clientSent) {
      console.error('Failed to send client confirmation email');
    }

    return NextResponse.json({
      success: true,
      briefId: insertedBrief.id,
      message: 'Brief submitted successfully',
    });
  } catch (error) {
    console.error('Brief submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit brief. Please try again or contact us directly.',
      },
      { status: 500 }
    );
  }
}


