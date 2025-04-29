import React from 'react';
import Header from "@/components/settings/Header";
import Menu from "@/components/settings/Menu";

const PrivacyPolicy = () => {
  return (
    <div className="w-full">
      {/* Header at the top */}
      <Header />

      {/* Flex container for Menu and Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar/Menu */}
        <Menu />

        <div className="container mx-auto px-4 py-10 flex flex-col justify-center w-full max-w-4xl">
           
          <h1 className="text-electric-blue font-qimnao text-3xl text-center mt-6">Privacy Policy for Snatch</h1>

          <div className="font-apfel-grotezk-regular text-graphite text-md mt-5">
            <p>Effective Date: October 10, 2024</p>

            <p className="mt-5">
              Snatch (We &quot;our&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and safeguard your personal data when you use Snatch, a digital D2C platform designed to simplify brand-influencer partnerships. By accessing or using our platform, you agree to this Privacy Policy. This policy complies with Meta’s guidelines for apps using Facebook login and all applicable data privacy regulations.
            </p>

            <p className="mt-5">
              <strong>1. Information We Collect</strong><br />
              We collect various types of information from users to facilitate brand-influencer partnerships and improve platform functionality. This includes:
              <br /><br />
              <strong>Personal Information:</strong> Such as your name, email address, username, and contact information when you create an account.<br />
              <strong>Login Data:</strong> When you use Facebook login, we collect and store authorized data from Facebook such as your public profile (name, profile picture), email, and any other information you agree to share.<br />
              <strong>Profile Information:</strong> For influencers and brands, we collect business-related information, including brand names, social media profiles, engagement statistics, and preferences.<br />
              <strong>Transaction Information:</strong> Data related to collaborations, agreements, and payments (if applicable).<br />
              <strong>Usage Data:</strong> Information on how you interact with Snatch, including activity logs, IP addresses, device identifiers, browser type, and page views.<br />
              <strong>Analytics and Metrics:</strong> Performance data, audience metrics, engagement rates, and similar information related to influencer and brand partnerships.
            </p>

            <p className="mt-5">
              <strong>2. How We Use Your Information</strong><br />
              We process your personal data for the following purposes:
              <br /><br />
              Facilitating Collaborations: To connect influencers and brands based on compatibility, preferences, and performance data.<br />
              Platform Functionality: To operate and improve the platform’s features, including verification, matchmaking, and contract management.<br />
              Analytics: To provide both influencers and brands with performance insights and data-driven metrics for campaign effectiveness.<br />
              Account Management: To manage your account, provide user support, and ensure the proper functioning of our services.<br />
              Communication: To send updates, notifications, and relevant messages about your account or platform services.<br />
              Legal Compliance: To comply with applicable laws, legal requests, and regulatory requirements.
            </p>

            <p className="mt-5">
              <strong>3. Legal Basis for Processing</strong><br />
              We process personal data on the following legal bases:
              <br /><br />
              Consent: Where you have provided explicit consent, such as when using Facebook login or opting to share additional information.<br />
              Contractual Obligation: To fulfill our contractual obligations, such as facilitating partnerships between influencers and brands.<br />
              Legitimate Interest: For our legitimate business interests, including platform improvements, security, fraud prevention, and user support.<br />
              Legal Compliance: To comply with legal obligations, including those related to data protection, consumer rights, and commercial laws.
            </p>

            <p className="mt-5">
              <strong>4. Data Sharing and Disclosure</strong><br />
              We do not sell, rent, or misuse your personal data. However, we may share information in the following cases:
              <br /><br />
              With Brands and Influencers: To facilitate verified and efficient partnerships.<br />
              With Service Providers: We may share data with trusted third-party vendors who assist in operating the platform (e.g., hosting services, analytics providers).<br />
              For Legal Purposes: If required by law or legal proceedings, or to protect the rights, safety, or property of Snatch, its users, or others.
            </p>

            <p className="mt-5">
              <strong>5. Use of Facebook Login</strong><br />
              When you use Facebook login to access Snatch, we only collect the data authorized by Facebook. This includes public profile data, email address, and any additional information you choose to share. Facebook’s own privacy policy governs the collection, use, and disclosure of your data by Facebook.<br />
              We do not post on your behalf, nor do we access your friends list, unless expressly permitted by you. You can control what information you share with us via your Facebook settings.
            </p>

            <p className="mt-5">
              <strong>6. Data Retention</strong><br />
              We retain personal data for as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request the deletion of your data at any time by contacting us at
              <span className='font-bold text-electric-blue ml-1'>
                <a href="mailto:mahirr@snatchsocial.com">mahirr@snatchsocial.com</a>
              </span>.
            </p>

            <p className="mt-5">
              <strong>7. Security of Your Information</strong><br />
              We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, disclosure, or misuse. However, no method of transmission or storage is 100% secure. You acknowledge that you use the platform at your own risk.
            </p>

            <p className="mt-5">
              <strong>8. Your Rights</strong><br />
              Depending on your location, you may have the following rights regarding your personal data:<br />
              Access: The right to access and obtain a copy of your personal data.<br />
              Correction: The right to rectify inaccurate or incomplete data.<br />
              Deletion: The right to request the deletion of your personal data.<br />
              Restriction: The right to restrict the processing of your data in certain circumstances.<br />
              Portability: The right to receive your personal data in a structured, commonly used, and machine-readable format.<br />
              To exercise these rights, please contact us at
              <span className='font-bold text-electric-blue ml-1'>
                <a href="mailto:mahirr@snatchsocial.com">mahirr@snatchsocial.com</a>
              </span>.
            </p>

            <p className="mt-5">
              <strong>9. Children’s Privacy</strong><br />
              Snatch is not intended for use by individuals under the age of 16, and we do not knowingly collect personal data from minors. If we become aware that we have collected data from a minor without verification of parental consent, we will take steps to delete such information.
            </p>

            <p className="mt-5">
              <strong>10. Changes to the Privacy Policy</strong><br />
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal obligations. We will notify users of significant changes through email or platform notifications. Please review this policy regularly.
            </p>

            <p className="mt-5">
              <strong>11. Contact Us</strong><br />
              If you have any questions or concerns about this Privacy Policy, please contact us at:<br />
              Email:
              <span className='font-bold text-electric-blue ml-1'>
                <a href="mailto:mahirr@snatchsocial.com">mahirr@snatchsocial.com</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
