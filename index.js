import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// POST /send-email
app.post("/send-email", async (req, res) => {
  const { name, email, message, service_interest } = req.body;

  try {
    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true = port 465, false = port 587
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    // Email to YOU (the website owner)
    const ownerMail = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; 
                    border: 1px solid #eee; border-radius: 8px; 
                    max-width: 600px; margin: auto;
                    background: linear-gradient(135deg, #005A9C, #00CED1);">
          <h2 style="color: #2c3e50;">📩 New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong style ="color: #fff;"> ${email}</p>
          <p><strong>Service Interest:</strong> ${
            service_interest || "General"
          }</p>
          <p><strong>Message:</strong></p>
          <div style="margin: 10px 0; padding: 12px; background: #f9f9f9; 
                      border-left: 4px solid #ffffffff; border-radius: 4px;">
            ${message}
          </div>
          <hr style="margin-top:20px; border:0; border-top:1px solid #ccc;" />
          <p style="font-size: 12px; color: #fff; text-align: center;">
            This email was sent automatically from your website contact form.
          </p>
        </div>
      `,
    };

    // Thank You email to the SENDER
    const thankYouMail = {
      from: `"MESM Company Ltd" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Thank You for Contacting Us!",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f6f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header with Logo -->
            <div style="background: linear-gradient(90deg, #3498db, #2ecc71); padding: 20px; text-align: center; color: #fff;">
             <img src="https://mesm.netlify.app/mesm.png" 
              alt="MESM Logo" 
              style="max-width: 120px; margin-bottom: 10px; border-radius: 50%;" />
              <h1 style="margin: 0;">Thank You, ${name}!</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 20px; color: #333;">
              <p style="font-size: 16px;">We have received your message and our team will get back to you soon.</p>
              <p style="font-size: 15px; margin-top: 10px;">
                <strong>Your Submission:</strong><br>
                <span style="color: #555;">${message}</span>
              </p>
              <p style="margin-top: 20px;">We appreciate your interest in our services (<strong>${
                service_interest || "General"
              }</strong>).</p>
              <p style="margin-top: 20px;">Meanwhile, feel free to explore our website for more information.</p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 13px; color: #777;">
              <p>MESM Company Ltd | Nairobi, Kenya</p>
              <p>© ${new Date().getFullYear()} MESM. All rights reserved.</p>
            </div>
            
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(ownerMail);
    await transporter.sendMail(thankYouMail);

    console.log("✅ Emails sent successfully");
    res.json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
