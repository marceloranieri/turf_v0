import { Metadata } from 'next';
import Link from 'next/link';
import { CURRENT_TERMS_VERSION, TERMS_VERSIONS } from '@/lib/constants/legal';

export const metadata: Metadata = {
  title: 'Terms of Service - Turf',
  description: 'Terms of Service for Turf',
};

export default function TermsOfServicePage(): JSX.Element {
  const currentVersion = TERMS_VERSIONS[CURRENT_TERMS_VERSION];
  const effectiveDate = new Date(currentVersion.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-background-secondary rounded-lg shadow-lg p-8">
        <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-text-primary">Terms of Service</h1>
          <p className="text-text-secondary mt-2">
            Last Updated: {effectiveDate}
          </p>
          <p className="text-text-secondary mt-1">
            Effective: {effectiveDate}
          </p>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Welcome to Turf!</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of Turf's website, services, and applications (collectively, the "Service"). 
              Please read these Terms carefully, as they constitute a legally binding agreement between you and Turf Inc. ("Turf," "we," "us").
            </p>
            <p>
              By using our Service, you agree to these Terms. If you don't agree to any of these Terms, you may not use the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Rights to Use the Service</h2>
            <p>
              Turf grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to use and access the Service, subject to these Terms.
            </p>
            <p>
              You may not:
            </p>
            <ul>
              <li>license, sell, rent, lease, transfer, or otherwise make available the Service to any third party;</li>
              <li>use the Service for any illegal purpose or in violation of any local, state, national, or international law;</li>
              <li>scrape, data mine, or access the Service through automated means;</li>
              <li>interfere with security features of the Service;</li>
              <li>interfere with the proper working of the Service.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Your Turf Account</h2>
            <p>
              To use certain features of the Service, you must register for an account. When registering, you must provide accurate and complete information and keep this information updated.
            </p>
            <p>
              You are solely responsible for:
            </p>
            <ul>
              <li>maintaining the confidentiality of your account password;</li>
              <li>restricting access to your account;</li>
              <li>all activities that occur under your account.</li>
            </ul>
            <p>
              You must notify Turf immediately of any unauthorized use of your account or any other breach of security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">User Content</h2>
            <p>
              Our Service allows you to create, post, share, and store content, including messages, text, photos, videos, and other materials (collectively, "User Content").
            </p>
            <p>
              You retain all rights to your User Content, but you grant Turf a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display your User Content in connection with the Service.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul>
              <li>you own or have the necessary rights to your User Content;</li>
              <li>your User Content does not violate the rights of any third party, including intellectual property rights and privacy rights;</li>
              <li>your User Content complies with these Terms and all applicable laws.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Community Guidelines</h2>
            <p>
              Turf is designed to foster meaningful conversations and connections. You agree not to use the Service to:
            </p>
            <ul>
              <li>post content that is illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise harmful;</li>
              <li>harass, abuse, or harm another person;</li>
              <li>impersonate any person or entity;</li>
              <li>engage in any automated use of the system, such as using scripts to send messages;</li>
              <li>interfere with or disrupt the Service or servers or networks connected to the Service;</li>
              <li>transmit any material that contains viruses, trojan horses, or other harmful computer code.</li>
            </ul>
            <p>
              We reserve the right to remove any User Content that violates these guidelines or that we find objectionable for any reason.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">AI Features and Content Processing</h2>
            <p>
              Turf uses artificial intelligence and machine learning to enhance the Service, including content moderation, recommendation systems, and conversation features.
            </p>
            <p>
              By using our Service, you acknowledge and agree that:
            </p>
            <ul>
              <li>your User Content may be processed by our AI systems;</li>
              <li>AI-generated content may be presented to you as part of the Service;</li>
              <li>AI features are provided "as is" without warranty of any kind;</li>
              <li>you can adjust your AI preferences in your account settings.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TURF EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              TURF MAKES NO WARRANTY THAT (i) THE SERVICE WILL MEET YOUR REQUIREMENTS, (ii) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (iii) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, OR (iv) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL TURF, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (i) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (ii) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, (iii) UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN, (iv) INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICE, (v) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICE, AND/OR (vi) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT THE COMPANY IS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              IN STATES THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Turf, its parent corporation, officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your User Content caused damage to a third party.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. If we make significant changes, we will notify you through the Service or by sending you an email or other communication. Your continued use of the Service after such notice constitutes your acceptance of the changes.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of California, without respect to its conflict of laws principles. You agree to submit to the personal jurisdiction of the federal and state courts located in San Francisco County, California.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <a href="mailto:team@turfyeah.com" className="text-accent-primary hover:text-accent-primary-dark">
                team@turfyeah.com
              </a>
            </p>
          </section>
        </div>
        
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-x-4">
              <Link
                href="/legal/privacy"
                className="text-accent-primary hover:text-accent-primary-dark transition-colors"
              >
                Privacy Policy
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