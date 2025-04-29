'use client';

import React from 'react';
import Header from "@/components/settings/Header";
import Menu from "@/components/settings/Menu";

const Terms = () => {
  return (
    <div className="relative w-full min-h-screen">
      <Header />

      <div className="flex flex-col md:flex-row relative z-0">
        <Menu />

        <div className="relative container mx-auto px-4 py-10 flex flex-col justify-center w-full max-w-4xl overflow-hidden">
          <h1 className="text-electric-blue font-qimnao text-3xl text-center mt-6">
            Terms and Services for Snatch
          </h1>

          <div className="font-apfel-grotezk-regular text-graphite text-md mt-5">
            <p>Effective Date: October 10, 2024</p>

            <p className="mt-5">
              These Terms of Service (&quot;Terms&quot;) govern your use of Snatch, a digital platform designed to connect influencers and brands for seamless collaborations. By accessing or using our platform, you agree to these Terms. If you do not agree, you must refrain from using our services.
            </p>

            <p className="mt-5">
              <strong>1. Account Registration and Responsibilities</strong><br />
              <strong>Eligibility:</strong> You must be at least 16 years old to use Snatch. By creating an account, you confirm that you meet this age requirement.<br />
              <strong>Account Creation:</strong> To use the platform, you must create an account and provide accurate, complete, and up-to-date information.<br />
              <strong>Login Credentials:</strong> You are responsible for maintaining the confidentiality of your login credentials and any activity under your account. If you suspect unauthorized access, notify us immediately.<br />
              <strong>Facebook Login:</strong> By using Facebook login, you authorize us to collect certain information from your Facebook profile, which is governed by our Privacy Policy.
            </p>

            <p className="mt-5">
              <strong>2. Services Provided</strong><br />
              Snatch provides the following services:<br />
              <strong>Connection Platform:</strong> We connect brands with influencers for potential collaborations.<br />
              <strong>Verification:</strong> Verified profiles ensure authenticity and trustworthiness for both parties.<br />
              <strong>Matchmaking:</strong> Snatch uses data-driven metrics to match brands with suitable influencers.<br />
              <strong>Contract Automation:</strong> We offer tools to formalize collaborations through automated, legally binding contracts.<br />
              <strong>Analytics:</strong> We provide insights and performance metrics to both brands and influencers.
            </p>

            <p className="mt-5">
              <strong>3. User Conduct</strong><br />
              You agree not to engage in any of the following prohibited activities:<br />
              - Using the platform for any unlawful purpose or to harm others.<br />
              - Impersonating another person or misrepresenting your affiliation with a third party.<br />
              - Engaging in fraudulent activities, including false profile information or misleading representations.<br />
              - Violating any applicable laws, regulations, or third-party rights.
            </p>

            <p className="mt-5">
              <strong>4. Intellectual Property</strong><br />
              Snatch and its licensors retain ownership of all intellectual property rights in the platform, including content, designs, logos, and trademarks. You may not reproduce, distribute, or otherwise use any Snatch intellectual property without prior written consent.
            </p>

            <p className="mt-5">
              <strong>5. Limitation of Liability</strong><br />
              To the maximum extent permitted by law, Snatch will not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to the outcome of brand-influencer collaborations, loss of profits, or data breaches.
            </p>

            <p className="mt-5">
              <strong>6. Termination</strong><br />
              Snatch reserves the right to suspend or terminate your account at our discretion if you violate these Terms or engage in harmful or unlawful activities.
            </p>

            <p className="mt-5">
              <strong>7. Changes to the Terms of Service</strong><br />
              We may modify these Terms from time to time to reflect changes in our services or legal obligations. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>

            <p className="mt-5">
              <strong>8. Governing Law</strong><br />
              These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
            </p>

            <p className="mt-5">
              <strong>9. Contact Us</strong><br />
              If you have any questions about these Terms, please contact us at:
              <span className='font-bold text-electric-blue ml-1'>
                <a href="mailto:mahirr@snatchsocial.com">mahirr@snatchsocial.com</a>
              </span>
            </p>
          </div>

          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
};

export default Terms;
