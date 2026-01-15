const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️ RESEND_API_KEY not set, skipping email');
      return { success: false, message: 'Email not configured' };
    }

    // For testing: override recipient to your own email
    const testEmail = 'parthjindal23316@gmail.com';
    console.log(`📧 Sending to: ${to} (overridden to ${testEmail} for testing)`);

    const data = await resend.emails.send({
      from: 'GigFlow <onboarding@resend.dev>',
      to: [testEmail], // Always send to your email for testing
      subject: `[TO: ${to}] ${subject}`, // Include original recipient in subject
      html,
      text: text || '',
    });

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };