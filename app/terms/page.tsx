"use client";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

const sections = [
  {
    title: "1. Agreement to Terms",
    body: `BY ACCESSING OR USING MOGGEDAI (THE "SERVICE"), YOU AGREE TO BE LEGALLY BOUND BY THESE TERMS OF SERVICE ("TERMS"). IF YOU DO NOT AGREE TO ALL OF THESE TERMS, YOU ARE PROHIBITED FROM USING THE SERVICE AND MUST CEASE USE IMMEDIATELY.

These Terms constitute a legally binding agreement between you ("User," "you," or "your") and MoggedAI ("Company," "we," "us," or "our"), operated by Wasseem Dabbas.

We reserve the right to modify these Terms at any time. Continued use of the Service following any modifications constitutes acceptance of the updated Terms. It is your responsibility to review these Terms periodically.`,
  },
  {
    title: "2. Eligibility",
    body: `To use the Service, you must:
• Be at least 18 years of age
• Have the legal capacity to enter into binding contracts
• Provide a valid U.S. mobile phone number capable of receiving SMS
• Not be prohibited from using the Service under any applicable law

By using the Service, you represent and warrant that you meet all of the above requirements. The Service is intended for use in the United States only. We make no representations that the Service is appropriate or available outside of the U.S.`,
  },
  {
    title: "3. Description of Service",
    body: `MoggedAI is a personal accountability platform that delivers AI-generated SMS text messages to help users stay consistent with self-defined habits and goals.

The Service includes:
• A web dashboard for configuring habits, schedules, and account settings
• Recurring automated SMS check-in messages delivered to your phone
• AI-generated responses to your SMS replies
• Habit completion logging and streak tracking

THE SERVICE IS PROVIDED FOR PERSONAL MOTIVATIONAL PURPOSES ONLY. It is not a healthcare service, mental health service, therapeutic service, coaching service, or professional advisory service of any kind.`,
  },
  {
    title: "4. User Accounts and Responsibilities",
    body: `ACCOUNT ACCURACY
You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for all activity that occurs under your account.

ACCOUNT SECURITY
You are solely responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at wasseem800@gmail.com if you suspect unauthorized access to your account. We are not liable for any loss resulting from unauthorized use of your account.

PHONE NUMBER RESPONSIBILITY
You represent and warrant that the mobile phone number you provide belongs to you. You agree not to provide a number belonging to another person without their explicit consent. You accept full responsibility and liability for any SMS messages sent to a number you provide.

ONE ACCOUNT PER USER
Each user may maintain only one account. Creating multiple accounts to circumvent restrictions is prohibited and may result in permanent termination of all associated accounts.`,
  },
  {
    title: "5. SMS Messaging Terms",
    body: `CONSENT
By completing account setup and checking the SMS consent checkbox, you provide express written consent to receive recurring automated text messages from MoggedAI. This consent is not required as a condition of any purchase.

TCPA COMPLIANCE
MoggedAI sends messages using automated technology. By providing consent, you acknowledge this and waive any claims under the Telephone Consumer Protection Act (TCPA) or similar state laws related to messages sent with your consent.

OPT-OUT
Text STOP at any time to immediately opt out. You will receive one final confirmation and no further messages will be sent. You may re-subscribe by texting START or through your dashboard.

NO GUARANTEE OF DELIVERY
We do not guarantee that messages will be delivered. Delivery depends on your carrier, device, and network conditions. We are not liable for undelivered, delayed, or misdirected messages.

CARRIER RATES
Standard message and data rates from your mobile carrier may apply. MoggedAI is not responsible for any charges from your carrier.`,
  },
  {
    title: "6. Prohibited Conduct",
    body: `You agree NOT to:

• Use the Service for any unlawful purpose or in violation of any applicable laws
• Provide false, misleading, or fraudulent information
• Use someone else's phone number without their explicit written consent
• Attempt to access, probe, or test the security of the Service or its infrastructure
• Reverse engineer, decompile, or attempt to extract the source code of any part of the Service
• Use the Service to harass, abuse, or harm any person
• Attempt to circumvent any rate limiting, security, or authentication measures
• Use automated tools, bots, or scripts to interact with the Service in unauthorized ways
• Resell, sublicense, or otherwise commercially exploit the Service without written permission
• Upload or transmit viruses, malware, or any other malicious code
• Interfere with the proper functioning of the Service or servers
• Violate the intellectual property rights of MoggedAI or any third party

Violation of any of the above may result in immediate account termination without notice and may subject you to legal liability.`,
  },
  {
    title: "7. Intellectual Property",
    body: `All content, features, functionality, branding, and technology comprising the Service — including but not limited to the MoggedAI name, logo, website design, dashboard, AI prompts, and message systems — are owned by MoggedAI and protected by United States and international intellectual property laws.

You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes only.

You may not copy, reproduce, modify, distribute, transmit, display, perform, publish, license, create derivative works from, or sell any part of the Service without our prior written consent.

Any feedback, suggestions, or ideas you submit to us may be used by us without compensation or attribution to you.`,
  },
  {
    title: "8. AI-Generated Content Disclaimer",
    body: `THE TEXT MESSAGES DELIVERED THROUGH THE SERVICE ARE GENERATED BY ARTIFICIAL INTELLIGENCE AND ARE PROVIDED SOLELY FOR PERSONAL MOTIVATIONAL AND ACCOUNTABILITY PURPOSES.

AI-GENERATED CONTENT IS NOT:
• Medical, psychological, or psychiatric advice
• Mental health treatment or therapy
• Nutritional, fitness, or health guidance
• Legal, financial, or professional advice of any kind
• A substitute for consultation with a licensed professional

WE MAKE NO REPRESENTATIONS THAT AI-GENERATED MESSAGES WILL BE ACCURATE, APPROPRIATE, EFFECTIVE, OR SUITABLE FOR YOUR SPECIFIC CIRCUMSTANCES.

YOU ASSUME ALL RISK ASSOCIATED WITH FOLLOWING OR ACTING ON AI-GENERATED MESSAGES. MOGGEDAI IS NOT RESPONSIBLE FOR ANY OUTCOME RESULTING FROM RELIANCE ON AI-GENERATED CONTENT.

If you are experiencing a mental health emergency, please call or text 988 or contact emergency services.`,
  },
  {
    title: "9. Disclaimer of Warranties",
    body: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

TO THE FULLEST EXTENT PERMITTED BY LAW, MOGGEDAI EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
• IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
• WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE
• WARRANTIES REGARDING THE ACCURACY OR RELIABILITY OF ANY CONTENT
• WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS
• WARRANTIES THAT DEFECTS WILL BE CORRECTED

WE DO NOT WARRANT THAT USING THE SERVICE WILL RESULT IN ANY SPECIFIC OUTCOME, BEHAVIOR CHANGE, HABIT FORMATION, OR IMPROVEMENT IN YOUR LIFE.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:

MOGGEDAI, ITS OWNERS, OPERATORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY:
• Indirect, incidental, special, consequential, or punitive damages
• Loss of profits, revenue, data, goodwill, or business opportunities
• Physical, psychological, or emotional harm allegedly caused by AI-generated messages
• Damages resulting from unauthorized access to or alteration of your data
• Damages resulting from any content transmitted or received through the Service
• Damages resulting from bugs, viruses, or other harmful components
• Damages resulting from any interruption, suspension, or termination of the Service

OUR TOTAL CUMULATIVE LIABILITY TO YOU SHALL NOT EXCEED THE GREATER OF:
(A) THE TOTAL FEES YOU PAID TO MOGGEDAI IN THE SIX (6) MONTHS PRECEDING THE CLAIM, OR
(B) ONE HUNDRED U.S. DOLLARS ($100.00)

SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIABILITY EXCLUSIONS OR LIMITATIONS. IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW.`,
  },
  {
    title: "11. Indemnification",
    body: `You agree to indemnify, defend, and hold harmless MoggedAI and its owners, officers, employees, contractors, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:

• Your use or misuse of the Service
• Your violation of these Terms
• Your violation of any law, regulation, or third-party right
• Your provision of a phone number you were not authorized to provide
• Any content or information you submit through the Service
• Claims by third parties arising from your use of the Service
• Your negligence or willful misconduct

We reserve the right to assume exclusive defense of any matter subject to indemnification by you, at your expense.`,
  },
  {
    title: "12. Dispute Resolution, Arbitration, and Class Action Waiver",
    body: `PLEASE READ THIS SECTION CAREFULLY. IT WAIVES YOUR RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN CLASS ACTION LAWSUITS.

INFORMAL RESOLUTION
Before initiating any formal dispute, you agree to contact us at wasseem800@gmail.com and attempt to resolve the issue informally for a period of 30 days.

BINDING ARBITRATION
If informal resolution fails, any dispute, claim, or controversy arising out of or relating to these Terms or the Service shall be resolved exclusively through final and binding individual arbitration. The arbitration shall be conducted by a neutral arbitrator under applicable arbitration rules. The arbitrator's decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.

CLASS ACTION WAIVER
YOU AND MOGGEDAI AGREE THAT ALL CLAIMS MUST BE BROUGHT IN YOUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS, COLLECTIVE, OR REPRESENTATIVE ACTION. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS. IF THIS CLASS ACTION WAIVER IS FOUND UNENFORCEABLE, THEN THE ENTIRE ARBITRATION PROVISION SHALL BE NULL AND VOID.

EXCEPTIONS
Either party may seek emergency injunctive or other equitable relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration.

JURY TRIAL WAIVER
TO THE EXTENT PERMITTED BY LAW, YOU WAIVE ANY RIGHT TO A JURY TRIAL FOR ANY CLAIM ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE.`,
  },
  {
    title: "13. Governing Law and Venue",
    body: `These Terms and any disputes arising hereunder shall be governed by the laws of the United States, without regard to its conflict of law provisions.

To the extent any dispute is not subject to arbitration, you consent to the exclusive jurisdiction and venue of courts located in the United States for resolution of such disputes.`,
  },
  {
    title: "14. Termination",
    body: `TERMINATION BY YOU
You may stop using the Service at any time. To delete your account, contact wasseem800@gmail.com.

TERMINATION BY US
We reserve the right to suspend or permanently terminate your access to the Service at any time, for any reason or no reason, with or without notice, including but not limited to violations of these Terms, suspected fraudulent activity, abuse, or inactivity.

EFFECT OF TERMINATION
Upon termination: your right to access the Service immediately ceases; your account data will be handled per our Privacy Policy; provisions of these Terms that by their nature should survive termination shall survive, including Sections 8–13.

We are not liable to you or any third party for termination of your access to the Service.`,
  },
  {
    title: "15. Severability",
    body: `If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, or severed if modification is not possible. The remaining provisions shall continue in full force and effect.`,
  },
  {
    title: "16. Entire Agreement",
    body: `These Terms, together with our Privacy Policy and SMS Consent policy, constitute the entire agreement between you and MoggedAI with respect to the Service and supersede all prior agreements, representations, and understandings.

Our failure to enforce any provision of these Terms shall not be construed as a waiver of that provision or our right to enforce it in the future.`,
  },
  {
    title: "17. Contact",
    body: `For questions about these Terms:

MoggedAI
Operator: Wasseem Dabbas
Email: wasseem800@gmail.com
Website: moggedai.com`,
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-root)", color: "var(--c-text)", fontFamily: GROTESK }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--c-nav)", borderBottom: "1px solid var(--c-border)", padding: "0 1.5rem", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--c-text)" }}>
            MOGGED<span style={{ color: "#0ea5e9" }}>AI</span>
          </button>
          <button onClick={() => router.back()} style={{ background: "none", border: "1px solid var(--c-border)", color: "var(--c-text3)", fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.35rem 0.75rem", cursor: "pointer" }}>
            ← BACK
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#0ea5e9", letterSpacing: "0.25em", marginBottom: "0.75rem" }}>LEGAL</div>
        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: "0.5rem", color: "var(--c-text)" }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--c-text3)", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
          Last updated: April 12, 2025
        </p>
        <p style={{ fontFamily: GROTESK, fontSize: "0.85rem", color: "var(--c-text3)", marginBottom: "3rem", lineHeight: 1.7, padding: "1rem", background: "var(--c-s1)", borderLeft: "3px solid #0ea5e9" }}>
          Please read these Terms of Service carefully before using MoggedAI. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", color: "#0ea5e9", marginBottom: "0.85rem" }}>
              {section.title}
            </h2>
            <div style={{ fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {section.body}
            </div>
          </div>
        ))}

        <div style={{ marginTop: "3rem", padding: "1.25rem", border: "1px solid var(--c-border)", background: "var(--c-s1)" }}>
          <p style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--c-text3)", letterSpacing: "0.1em", margin: 0, lineHeight: 1.8 }}>
            These Terms were last reviewed and updated on April 12, 2025. Questions? Contact wasseem800@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}
