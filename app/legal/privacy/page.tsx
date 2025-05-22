import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Turf',
  description: 'Privacy Policy for Turf',
};

export default function PrivacyPolicyPage(): JSX.Element {
  const effectiveDate = new Date('2024-05-18').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-background-secondary rounded-lg shadow-lg p-8">
        <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-text-primary">Privacy Policy</h1>
          <p className="text-text-secondary mt-2">
            Last Updated: {effectiveDate}
          </p>
          <p className="text-text-secondary mt-1">
            Effective: {effectiveDate}
          </p>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              At Turf, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and any other services offered by Turf (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. By using the Service, you consent to the practices described in this policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6">Information You Provide</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> When you register, we collect your username, email address, password, date of birth, and any optional profile information you provide.</li>
              <li><strong>User Content:</strong> We collect content you create, upload, or receive from others while using the Service, including messages, images, audio, and videos.</li>
              <li><strong>Communications:</strong> If you contact us directly, we may receive additional information about you, such as your name, email address, phone number, and the contents of your message.</li>
              <li><strong>Payment Information:</strong> If you make purchases through the Service, our third-party payment processors collect payment information.</li>
              <li><strong>Surveys and Feedback:</strong> We collect information you provide when participating in surveys, contests, or providing feedback.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6">Information We Collect Automatically</h3>
            <p>When you use our Service, we automatically collect certain information, including:</p>
            <ul>
              <li><strong>Device Information:</strong> We collect information about your device, including IP address, device type, operating system, browser type, mobile network information, and device identifiers.</li>
              <li><strong>Usage Information:</strong> We collect information about how you use the Service, such as the pages or content you view, your actions within the Service, and the time, frequency, and duration of your activities.</li>
              <li><strong>Location Information:</strong> With your permission, we may collect precise location information from your device.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6">Information From Third Parties</h3>
            <p>We may receive information about you from third parties, including:</p>
            <ul>
              <li><strong>Social Media Platforms:</strong> If you choose to link your Turf account to a social media account, we may receive information from that platform.</li>
              <li><strong>Analytics Providers:</strong> We work with analytics providers who help us understand how users interact with our Service.</li>
              <li><strong>Advertising Partners:</strong> We may receive information from our advertising partners to provide targeted advertisements.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service;</li>
              <li>Create and maintain your account;</li>
              <li>Process transactions;</li>
              <li>Send you technical notices, updates, security alerts, and administrative messages;</li>
              <li>Respond to your comments, questions, and customer service requests;</li>
              <li>Personalize your experience;</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service;</li>
              <li>Detect, prevent, and address technical issues, security incidents, and fraudulent or illegal activity;</li>
              <li>Develop new products and services;</li>
              <li>Comply with legal obligations;</li>
              <li>Carry out any other purpose described to you at the time the information was collected.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">How We Share Your Information</h2>
            <p>We may share information about you as follows:</p>
            <ul>
              <li><strong>With Other Users:</strong> When you use certain features, information you provide may be displayed to other users. For example, your profile information and content you post may be visible to others depending on your settings.</li>
              <li><strong>With Service Providers:</strong> We share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
              <li><strong>For Legal Reasons:</strong> We may share information if we believe disclosure is necessary or appropriate to comply with laws, regulations, legal processes, or governmental requests.</li>
              <li><strong>In Connection with a Merger, Sale, or Acquisition:</strong> We may share information in connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With Your Consent:</strong> We may share information with your consent or at your direction.</li>
              <li><strong>Aggregated or De-identified Information:</strong> We may share aggregated or de-identified information, which cannot reasonably be used to identify you.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Data Retention</h2>
            <p>
              We store the information we collect about you for as long as is necessary for the purposes for which we collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations.
            </p>
            <p>
              To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the information, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the information, and applicable legal requirements.
            </p>
            <p>
              In some circumstances, we may anonymize your information so that it can no longer be associated with you, in which case we may use such information without further notice to you.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Your Rights and Choices</h2>
            <p>
              You have several rights and choices regarding your information:
            </p>
            
            <h3 className="text-xl font-medium mt-6">Account Information</h3>
            <p>
              You can update your account information at any time by logging into your account and modifying your profile. You can also contact us to request updates or corrections.
            </p>
            
            <h3 className="text-xl font-medium mt-6">Communication Preferences</h3>
            <p>
              You can opt out of receiving promotional emails from Turf by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
            </p>
            
            <h3 className="text-xl font-medium mt-6">Cookies</h3>
            <p>
              Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Service.
            </p>
            
            <h3 className="text-xl font-medium mt-6">Privacy Settings</h3>
            <p>
              You can adjust your privacy settings within the Service to control what information is visible to other users and how your information is used.
            </p>
            
            <h3 className="text-xl font-medium mt-6">Data Access, Correction, and Deletion</h3>
            <p>
              You may have the right to access, correct, or delete personal information we have about you. You can request access to, correction of, or deletion of your personal information by contacting us at <a href="mailto:team@turfyeah.com">team@turfyeah.com</a>. We will respond to your request within a reasonable timeframe.
            </p>
            <p>
              For more detailed information on data deletion, please see our <Link href="/legal/data-deletion" className="text-accent-primary hover:text-accent-primary-dark">Data Deletion Policy</Link>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational measures designed to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">International Data Transfers</h2>
            <p>
              Turf is based in the United States, and we process and store information on servers located in the United States. If you are located outside the United States, your information may be transferred to, stored, and processed in a country different from your country of residence, including the United States.
            </p>
            <p>
              By using the Service, you consent to this transfer, storing, and processing of your information in the United States and other countries, which may have different data protection laws than those in your country of residence.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Children's Privacy</h2>
            <p>
              Our Service is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information as quickly as possible. If you believe a child under 13 has provided us with personal information, please contact us.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">California Privacy Rights</h2>
            <p>
              California Civil Code Section 1798.83 permits California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please write to us at the address below.
            </p>
            <p>
              California residents may also have additional rights under the California Consumer Privacy Act (CCPA) regarding their personal information. These rights may include the right to know what personal information we collect, the right to request deletion of personal information, and the right to opt-out of the sale of personal information.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              <a href="mailto:team@turfyeah.com" className="text-accent-primary hover:text-accent-primary-dark">
                team@turfyeah.com
              </a>
            </p>
            <p>
              Turf Inc.<br />
              123 Turf Street<br />
              San Francisco, CA 94103<br />
              United States
            </p>
          </section>
        </div>
        
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-x-4">
              <Link
                href="/legal/terms"
                className="text-accent-primary hover:text-accent-primary-dark transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/data-deletion"
                className="text-accent-primary hover:text-accent-primary-dark transition-colors"
              >
                Data Deletion
              </Link>
            </div>
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} Turf Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
} 