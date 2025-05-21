
import { NextResponse } from "next/server";
import connectDB from "@/db/mongoose";
import User from "@/models/user.model";
import CollaborationRequest from "@/models/collaborationRequest.model"; // ✅ import
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export async function POST(req) {
  try {
    const body = await req.json();
    const { brandName, role, email, bio, discussion, influencerUsername } = body;

    await connectDB();

    // Find influencer
    const influencer = await User.findOne({ instagramUsername: influencerUsername });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const influencerUserId = influencer.userId;

    // Step 1: Check for existing request
    const existingRequest = await CollaborationRequest.findOne({
      email,
      influencerUserId,
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You've already contacted this influencer." },
        { status: 400 }
      );
    }

    // Step 2: Get influencer email from Clerk
    const clerkUser = await clerkClient.users.getUser(influencerUserId);
    const influencerEmail = clerkUser.emailAddresses[0].emailAddress;

    // Step 3: Send email
    const emailResponse = await resend.emails.send({
      from: "Snatch <no-reply@snatchsocial.com>",
      to: influencerEmail,
      subject: `${brandName} is interested in working with you!`,
      html: `
       <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Snatch Social Request</title>
      <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
      padding: 20px;
    }
    
    .email-container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }
    
    .email-content {
      padding: 24px;
    }
    
    h1 {
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 16px;
      color: #111827;
    }
    
    .sender-info {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .sender-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
    
    .sender-name {
      font-size: 14px;
      color: #6b7280;
    }
    
    .logo-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .logo {
      width: 120px;
    }
    
    hr {
      border: 0;
      height: 1px;
      background: #e5e7eb;
      margin: 24px 0;
    }
    
    .profile-section {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden; /* Ensures image stays within circle */
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

    .profile-name {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
    }
    
    .description {
      color: #212121;
      font-size: 14px;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }
    
    .form-row.full {
      grid-template-columns: 1fr;
    }
    
    .input-field {
      display: block;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
    }
    
    .question-group {
      margin-bottom: 24px;
    }
    
    .question-label {
      display: block;
      font-weight: 500;
      color: #111827;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .text-area {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: #6b7280;
    }
    
    .footer {
      margin-top: 32px;
      text-align: center;
      color: #212121;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      padding-top: 24px;
      line-height: 1.5;
    }
    
    .footer .star {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      color: #f59e0b;
    }
    
    .footer .highlight {
      color: #0037EB;
      font-weight: 500;
    }
    
    .footer a {
      color: #0037EB;
      text-decoration: none;
      font-weight: 500;
    }
    
    .disclaimer {
      color: #9ca3af;
      font-size: 12px;
      text-align: center;
      margin-top: 24px;
      padding: 0 24px 24px;
    }
    
    .disclaimer a {
      color: #0037EB;
      text-decoration: none;
    }
    
  .social-links {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 16px;
  margin: 16px 0;
  padding: 0;
}

.social-link {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  text-decoration: none;
  padding: 4px;
}

.social-link img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

    .brand-logo {
      text-align: center;
      margin: 16px 0;
    }
    
    .brand-logo img {
      height: 24px;
    }
    
    @media (max-width: 520px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      
      <!-- Logo -->
      <div class="logo-container">
        <img src="https://res.cloudinary.com/dgk9ok5fx/image/upload/v1746449969/Group_7976_lgclm1.png" alt="Snatch" class="logo"/>
      </div>
      
      <!-- Divider -->
      <hr />
      
      <!-- Profile section -->
      <div class="profile-section">
       <div class="profile-avatar">
        <img src="https://res.cloudinary.com/dgk9ok5fx/image/upload/v1746738444/Couple_Icon_kunubf.png" alt="Avatar" />
      </div>

        <div class="profile-name">${brandName}</div>
      </div>
      
      <!-- Instruction -->
      <div class="description">
        Review their request and reply to keep the conversation going! Even if it's not a good fit, please respond to let them know.
      </div>
      
      <!-- Brand name & role -->
      <div class="form-row">
        <div class="input-field">${brandName}</div>
        <div class="input-field">${influencerUsername}</div>
      </div>
      
      <!-- Email -->
      <div class="form-row full">
        <div class="input-field">${email}</div>
      </div>
      
      <!-- First question -->
      <div class="question-group">
        <label class="question-label">What does the brand do?*</label>
        <div class="text-area">${role}</div>
      </div>
      
      <!-- Second question -->
      <div class="question-group">
        <label class="question-label">What would you like to discuss?*</label>
        <div class="text-area">${discussion}</div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <span class="star">★</span>
        <span class="highlight">You're onto big things</span>
        <p>
          This is what it's about—getting noticed for your work, not just your following. We built Snatch for creators like you—the ones with real voice and real talent, to give you a real shot at success.
        </p>
        <a href="https://snatchsocial.com">snatchsocial.com</a>
      </div>
    </div>
    
    <hr />
    
    <div class="disclaimer">
      You are receiving this email because you registered to join Snatch Social as a user. This means that you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </div>
    
 <div class="social-links">
  <a href="https://instagram.com" class="social-link" target="_blank" rel="noopener">
    <img src="https://res.cloudinary.com/dgk9ok5fx/image/upload/v1746448772/Variant15_gchrdh.png" width="24" alt="Instagram" />
  </a>
  <a href="https://facebook.com" class="social-link" target="_blank" rel="noopener">
    <img src="https://res.cloudinary.com/dgk9ok5fx/image/upload/v1746448721/Variant14_harhti.png" width="24" alt="Facebook" />
  </a>
</div>

    
    <div class="brand-logo">
      <img src="https://res.cloudinary.com/dgk9ok5fx/image/upload/v1746449969/Group_7976_lgclm1.png" alt="Snatch" />
    </div>
  </div>
</body>
</html>
      `
    });

    console.log("Email resposne", emailResponse);

    // Step 4: Save new request to DB
    await CollaborationRequest.create({
      brandName,
      email,
      role,
      bio,
      discussion,
      influencerUsername,
      influencerUserId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in send-request API:", error);

    if (error.code === 11000) {
      // Duplicate key error (from unique index)
      return NextResponse.json(
        { error: "You've already contacted this influencer." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
