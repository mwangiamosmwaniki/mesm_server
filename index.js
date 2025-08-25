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

    // Email content
    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`, // must be your Gmail
      replyTo: email, // so you can hit "Reply" to reach the sender
      to: process.env.EMAIL_RECEIVER, // recipient (your inbox)
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Service Interest: ${service_interest || "General"}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Interest:</strong> ${service_interest || "General"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
