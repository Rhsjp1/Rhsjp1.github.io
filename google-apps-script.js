/**
 * RHS AI Solutions — Google Apps Script Form Handler
 * 
 * Handle form submissions from rhsjp1.github.io:
 * - Send notification emails to RHS team
 * - Send confirmation emails to leads
 * - Log submissions to Google Sheet for lead tracking
 * - Auto-trigger PDF download for lead magnets
 * 
 * Setup:
 * 1. Go to https://script.google.com
 * 2. Create new project
 * 3. Paste this code
 * 4. Create a Google Sheet and copy its ID into SHEET_ID below
 * 5. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL and paste into form-handler.js line 17
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email;
    var page = data.page;
    var type = data.type;
    var timestamp = data.timestamp || new Date().toISOString();
    var source = data.source || '';
    
    // 1. Send notification to RHS team
    MailApp.sendEmail({
      to: 'righthandservicesbyjp@gmail.com,rhsjp01@gmail.com',
      subject: '🔔 RHS ' + type + ' submission from ' + page,
      htmlBody: '<h2>New RHS Website Lead</h2>' +
        '<table style="border-collapse:collapse;font-family:sans-serif;">' +
        '<tr><td style="padding:8px;background:#f3f4f6;"><strong>Email</strong></td><td style="padding:8px;">' + email + '</td></tr>' +
        '<tr><td style="padding:8px;background:#f3f4f6;"><strong>Page</strong></td><td style="padding:8px;">' + page + '</td></tr>' +
        '<tr><td style="padding:8px;background:#f3f4f6;"><strong>Type</strong></td><td style="padding:8px;">' + type + '</td></tr>' +
        '<tr><td style="padding:8px;background:#f3f4f6;"><strong>Time</strong></td><td style="padding:8px;">' + timestamp + '</td></tr>' +
        '<tr><td style="padding:8px;background:#f3f4f6;"><strong>Source</strong></td><td style="padding:8px;">' + source + '</td></tr>' +
        '</table>' +
        '<p><a href="' + source + '">View page</a> | <a href="mailto:' + email + '">Reply to lead</a></p>' +
        '<hr><p style="color:#666;font-size:12px;">Automated notification from rhsjp1.github.io</p>'
    });
    
    // 2. Send confirmation to lead
    var pdfLinks = {
      '/free/turf-grass-selection-guide.html': 'https://Rhsjp1.github.io/assets/pdfs/turf-grass-selection-guide.pdf',
      '/free/french-drain-cheat-sheet.html': 'https://Rhsjp1.github.io/assets/pdfs/french-drain-cheat-sheet.pdf',
      '/free/soil-health-starter-guide.html': 'https://Rhsjp1.github.io/assets/pdfs/soil-health-starter-guide.pdf',
      '/free/seasonal-maintenance-calendar.html': 'https://Rhsjp1.github.io/assets/pdfs/seasonal-maintenance-calendar.pdf',
      '/free/ai-automation-readiness-checklist.html': 'https://Rhsjp1.github.io/assets/pdfs/ai-automation-readiness-checklist.pdf',
      '/promo/turf-management-brochure.html': 'https://Rhsjp1.github.io/assets/pdfs/turf-management-brochure.pdf',
      '/promo/regenerative-landscaping-portfolio.html': 'https://Rhsjp1.github.io/assets/pdfs/regenerative-landscaping-portfolio.pdf',
      '/promo/ai-solutions-capabilities.html': 'https://Rhsjp1.github.io/assets/pdfs/ai-solutions-capabilities.pdf',
      '/promo/sample-due-diligence-report.html': 'https://Rhsjp1.github.io/assets/pdfs/sample-due-diligence-report.pdf',
      '/promo/drainage-solutions-brochure.html': 'https://Rhsjp1.github.io/assets/pdfs/drainage-solutions-brochure.pdf'
    };
    
    var pdfUrl = pdfLinks[page];
    var emailBody = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">' +
      '<div style="background:#111827;padding:20px;text-align:center;">' +
      '<h1 style="color:#D97706;margin:0;">Right Hand Services by JP</h1>' +
      '<p style="color:#9ca3af;margin:4px 0 0;">Property Intelligence & Regenerative Landscaping</p>' +
      '</div>' +
      '<div style="padding:24px;">' +
      '<h2>Thanks for your interest!</h2>' +
      '<p>You requested content from <strong>' + page + '</strong>.</p>';
    
    if (pdfUrl) {
      emailBody += '<p><a href="' + pdfUrl + '" style="display:inline-block;background:#D97706;color:#111827;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Download Your PDF</a></p>';
    }
    
    emailBody += '<p>Have questions? Call us at <strong>317-395-3309</strong> or reply to this email.</p>' +
      '</div>' +
      '<div style="background:#f3f4f6;padding:16px;font-size:12px;color:#666;">' +
      '<p><strong>Right Hand Services by JP</strong><br>' +
      '514 Brutonville Rd, Candor, NC 27229<br>' +
      'Phone: 317-395-3309<br>' +
      'Email: righthandservicesbyjp@gmail.com</p>' +
      '</div></div>';
    
    MailApp.sendEmail({
      to: email,
      subject: 'Your RHS download is ready',
      htmlBody: emailBody
    });
    
    // 3. Log to Google Sheet
    try {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      sheet.appendRow([new Date(), email, page, type, source, timestamp]);
    } catch (sheetErr) {
      // Sheet logging failed but email still sent — don't block response
      Logger.log('Sheet logging failed: ' + sheetErr.message);
    }
    
    // 4. Return success with PDF URL if applicable
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      pdfUrl: pdfUrl || null
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Health check endpoint
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'RHS AI Solutions form handler is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
