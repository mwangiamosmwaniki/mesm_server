import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Email route
app.post("/send-email", async (req, res) => {
  const { name, email, message, service_interest } = req.body;

  try {
    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or smtp.office365, sendgrid, etc.
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER, // where you want to receive messages
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Service Interest: ${service_interest || "General"}
        Message: ${message}
      `,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
