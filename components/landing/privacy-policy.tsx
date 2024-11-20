import React from "react";

export default function PrivacyPolicyText() {
  return (
    <>
      <h1 className="text-2xl font-bold">ChainLink Privacy Policy</h1>

      <p className="mt-4">
        This Privacy Policy outlines how ChainLink (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and discloses
        information about users of our website (the &ldquo;Site&rdquo;).
      </p>

      <h2 className="text-xl font-bold mt-8">Information We Collect</h2>
      <p className="mt-2">
        We may collect the following information from you:
        <ul className="list-disc list-inside mt-2">
          <li>
            Personal information, such as your name, email address, and phone
            number
          </li>
          <li>
            Demographic information, such as your age, gender, and location
          </li>
          <li>
            Usage information, such as the pages you visit and the links you
            click on Device information, such as your IP address, browser type,
            and operating system
          </li>
        </ul>
      </p>

      <h2 className="text-xl font-bold mt-8">How We Use Your Information</h2>
      <p className="mt-2">
        We may use your information to:
        <ul className="list-disc list-inside mt-2">
          <li>Provide and improve the Site</li>
          <li>Personalize your experience on the Site</li>
          <li>Send you marketing and promotional materials</li>
          <li>Communicate with you about changes to the Site</li>
          <li>Comply with legal requirements</li>
        </ul>
      </p>
      <h2 className="text-xl font-bold mt-8">How We Share Your Information</h2>
      <p className="mt-2">We may share your information with:</p>
      <ul className="list-disc list-inside mt-2">
        <li>Third-party service providers who help us operate the Site</li>
        <li>
          Law enforcement or other government agencies, if required by law
        </li>
      </ul>
      <h2 className="text-xl font-bold mt-8">Security</h2>
      <p className="mt-2">
        We take reasonable steps to protect your information from unauthorized
        access, use, or disclosure. However, no data transmission over the
        Internet is completely secure. As a result, we cannot guarantee the
        security of your information.
      </p>
      <h2 className="text-xl font-bold mt-8">Your Choices</h2>
      <p className="mt-2">
        You have the following choices regarding your information:
        <ul className="list-disc list-inside mt-2">
          <li>
            Opt out of receiving marketing and promotional materials from us
          </li>
          <li>Request to access, correct, or delete your information</li>
        </ul>
      </p>
      <h2 className="text-xl font-bold mt-8">Contact Us</h2>
      <p className="mt-2">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a href="mailto:chainmaster@chainlink.st" className="underline">
          chainmaster@chainlink.st
        </a>
      </p>
    </>
  );
}
