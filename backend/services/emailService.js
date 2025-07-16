const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const getEmailTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error(`Template ${templateName} not found, using fallback`);
    return getFallbackTemplate(templateName);
  }
};

const getFallbackTemplate = (templateName) => {
  const templates = {
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D97706 0%, #92400E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Taksha Veda!</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Handcrafted with Love, Delivered with Care</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #D97706; margin-bottom: 20px;">Hello {{name}}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for joining the Taksha Veda family! We're excited to have you on this journey of discovering beautiful, handcrafted products that celebrate Indian artistry and culture.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Explore our collections of corporate gifts, home decor, spiritual items, and personalized creations - each piece crafted with passion and attention to detail.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{frontendUrl}}" style="background: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start Shopping</a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            The Taksha Veda Team
          </p>
        </div>
      </div>
    `,
    orderConfirmation: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D97706 0%, #92400E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Order #{{orderNumber}}</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #D97706; margin-bottom: 20px;">Thank you for your order, {{customerName}}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your order has been confirmed and is being processed. You'll receive another email once your items have been shipped.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #D97706; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order Number:</strong> {{orderNumber}}</p>
            <p><strong>Order Date:</strong> {{orderDate}}</p>
            <p><strong>Payment Status:</strong> {{paymentStatus}}</p>
            <p><strong>Total Amount:</strong> ₹{{totalAmount}}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #D97706; margin-bottom: 15px;">Items Ordered</h3>
            {{itemsHtml}}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #D97706; margin-bottom: 15px;">Shipping Address</h3>
            <p>{{shippingAddress}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{frontendUrl}}/orders" style="background: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Your Order</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If you have any questions about your order, please contact us at support@takshaveda.com
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            The Taksha Veda Team
          </p>
        </div>
      </div>
    `,
    orderShipped: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Order Shipped!</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Order #{{orderNumber}}</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #059669; margin-bottom: 20px;">Your order is on its way, {{customerName}}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Great news! Your order has been shipped and is on its way to you. You can track your package using the tracking number below.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-bottom: 15px;">Shipping Details</h3>
            <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
            <p><strong>Carrier:</strong> {{carrier}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{trackingUrl}}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Package</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            The Taksha Veda Team
          </p>
        </div>
      </div>
    `,
    passwordReset: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Taksha Veda Account</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #DC2626; margin-bottom: 20px;">Hello {{name}}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            You recently requested to reset your password for your Taksha Veda account. Click the button below to reset it.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            This password reset link will expire in 1 hour.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            The Taksha Veda Team
          </p>
        </div>
      </div>
    `
  };
  
  return templates[templateName] || templates.welcome;
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const template = getEmailTemplate('welcome');
    const html = template
      .replace(/{{name}}/g, name)
      .replace(/{{frontendUrl}}/g, process.env.FRONTEND_URL);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Taksha Veda - Handcrafted with Love!',
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    const user = await require('../models/User').findById(order.user);
    if (!user) return;
    
    const template = getEmailTemplate('orderConfirmation');
    
    // Generate items HTML
    const itemsHtml = order.items.map(item => `
      <div style="border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
        <div>
          <h4 style="margin: 0 0 5px; color: #333;">${item.name}</h4>
          <p style="margin: 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
          <p style="margin: 0; color: #D97706; font-weight: bold;">₹${item.price} each</p>
        </div>
      </div>
    `).join('');
    
    const shippingAddress = `
      ${order.shippingAddress.name}<br>
      ${order.shippingAddress.addressLine1}<br>
      ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
      ${order.shippingAddress.country}<br>
      Phone: ${order.shippingAddress.phone}
    `;
    
    const html = template
      .replace(/{{customerName}}/g, user.name)
      .replace(/{{orderNumber}}/g, order.orderNumber)
      .replace(/{{orderDate}}/g, order.createdAt.toLocaleDateString())
      .replace(/{{paymentStatus}}/g, order.payment.status.toUpperCase())
      .replace(/{{totalAmount}}/g, order.pricing.total.toLocaleString())
      .replace(/{{itemsHtml}}/g, itemsHtml)
      .replace(/{{shippingAddress}}/g, shippingAddress)
      .replace(/{{frontendUrl}}/g, process.env.FRONTEND_URL);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send order shipped email
const sendOrderShippedEmail = async (order) => {
  try {
    const user = await require('../models/User').findById(order.user);
    if (!user) return;
    
    const template = getEmailTemplate('orderShipped');
    
    const html = template
      .replace(/{{customerName}}/g, user.name)
      .replace(/{{orderNumber}}/g, order.orderNumber)
      .replace(/{{trackingNumber}}/g, order.shipping.trackingNumber || 'N/A')
      .replace(/{{carrier}}/g, order.shipping.carrier || 'Standard Shipping')
      .replace(/{{estimatedDelivery}}/g, order.shipping.estimatedDelivery ? order.shipping.estimatedDelivery.toLocaleDateString() : 'N/A')
      .replace(/{{trackingUrl}}/g, order.shipping.trackingNumber ? `https://example.com/track/${order.shipping.trackingNumber}` : '#')
      .replace(/{{frontendUrl}}/g, process.env.FRONTEND_URL);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Shipped - #${order.orderNumber}`,
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Order shipped email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order shipped email:', error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const template = getEmailTemplate('passwordReset');
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = template
      .replace(/{{name}}/g, name)
      .replace(/{{resetUrl}}/g, resetUrl);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Taksha Veda',
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (order, status, message) => {
  try {
    const user = await require('../models/User').findById(order.user);
    if (!user) return;
    
    const statusColors = {
      confirmed: '#059669',
      processing: '#D97706',
      shipped: '#059669',
      out_for_delivery: '#0EA5E9',
      delivered: '#059669',
      cancelled: '#DC2626',
      returned: '#DC2626'
    };
    
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is currently being processed.',
      shipped: 'Your order has been shipped and is on its way.',
      out_for_delivery: 'Your order is out for delivery.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
      returned: 'Your order has been returned.'
    };
    
    const color = statusColors[status] || '#D97706';
    const statusMessage = statusMessages[status] || message;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Order Update</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Order #${order.orderNumber}</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: ${color}; margin-bottom: 20px;">Hello ${user.name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            ${statusMessage}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${color}; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> ${status.toUpperCase()}</p>
            <p><strong>Total Amount:</strong> ₹${order.pricing.total.toLocaleString()}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders" style="background: ${color}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Order Details</a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            The Taksha Veda Team
          </p>
        </div>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Update - #${order.orderNumber}`,
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
  }
};

// Send contact form email
const sendContactFormEmail = async (formData) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #D97706; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Contact Form Submission</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #D97706; margin-bottom: 20px;">Contact Details</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">${formData.message}</p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Received at: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${formData.subject}`,
      html,
      replyTo: formData.email
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Contact form email sent to admin');
  } catch (error) {
    console.error('Error sending contact form email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendPasswordResetEmail,
  sendOrderStatusUpdateEmail,
  sendContactFormEmail
};