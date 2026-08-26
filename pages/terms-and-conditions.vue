<script lang='ts' setup>
  definePageMeta({ colorMode: 'light', layout: 'public-layout' });

  useHead({
    meta: [
      {
        content: 'Terms and Conditions of Use for Gear Closet',
        name: 'description'},
    ],
    title: 'Terms and Conditions',
  });

  const tableOfContents = [
    { copy: 'Changes to these Terms and Conditions', id: 'changes' },
    { copy: 'Disclaimer', id: 'disclaimer' },
    { copy: 'Membership Privileges', id: 'membership-privileges' },
    { copy: 'Subscription Refund Policy', id: 'subscription-refund-policy' },
    { copy: 'Fraud Management Policies', id: 'fraud-management' },
    { copy: 'Security Statement', id: 'security-statement' },
    { copy: 'Chat and Message Board Policy', id: 'chat-message-board-policy' },
    { copy: 'Privacy Policy', id: 'privacy-policy' },
    { copy: 'Disclosure', id: 'disclosure' },
  ];

  const scrollToSection = (anchor: string): void => {
    const element = document.querySelector(`#${anchor}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
</script>

<template>
  <div class="flex justify-center mt-14">
    <div class="w-full md:max-w-4xl md:mx-auto">
      <h5 class="mb-4 text-2xl text-center">
        Terms and Conditions of Use
      </h5>

      <!-- Table of Contents -->
      <section class="my-12">
        <p class="font-bold text-base uppercase">
          Contents
        </p>
        <ol class="list-decimal list-outside pl-4">
          <li
            v-for="content in tableOfContents"
            :key="content.id">
            <p class="mb-2 text-base">
              <a
                class="text-primary hover:underline"
                href="#"
                @click.prevent="scrollToSection(content.id)"
                @keydown.prevent="scrollToSection(content.id)">
                {{ content.copy }}
              </a>
            </p>
          </li>
        </ol>
      </section>

      <!-- Changes to T&C -->
      <section
        id="changes"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Changes to these Terms and Conditions
        </p>
        <p class="mb-4 text-sm">
          These terms and conditions may change from time to time. Your use
          of this website, and the privileges associated with the purchase
          of your membership, constitute the automatic acceptance of these
          terms and conditions.
        </p>
      </section>

      <!-- Disclaimer -->
      <section
        id="disclaimer"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Disclaimer
        </p>
        <p class="mb-4 text-sm">
          This Web site is a compilation of information, perspectives, and
          opinions and is provided to the reader with no warranty
          whatsoever.
        </p>
        <p class="mb-4 text-sm">
          The content herein does not, in any part, comprise a safety
          manual. In contrast, it provides information about taking more
          risks when you enter the backcountry. Consequently, it is not
          intended for beginning backpackers or those that otherwise do
          not already know how to stay dry and warm in inclement weather,
          possess wilderness survival skills, and know how to recognize
          and avoid dangerous situations.
        </p>
        <p class="mb-4 text-sm">
          Therefore, be warned that you must exercise your own judgment in
          evaluating the accuracy, applicability, and utility of the
          information provided herein.
        </p>
        <p class="mb-4 text-sm">
          THERE ARE NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, THAT
          INFORMATION PROVIDED AT THIS WEB SITE IS ACCURATE OR RELIABLE.
          THERE ARE NO WARRANTIES OF FITNESS OR TIMELINESS FOR A
          PARTICULAR PURPOSE OR THAT THIS WEB SITE IS MERCHANTABLE. YOUR
          USE OF THIS WEB SITE INDICATES YOUR ASSUMPTION OF THE RISK THAT
          IT MAY CONTAIN ERRORS AND IS AN ACKNOWLEDGMENT OF YOUR OWN SOLE
          RESPONSIBILITY FOR YOUR HIKING, BACKPACKING, AND MOUNTAINEERING
          SAFETY.
        </p>
      </section>

      <!-- Membership Privileges -->
      <section
        id="membership-privileges"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Membership Privileges
        </p>
        <p class="mb-4 text-sm">
          The primary purpose of paid memberships at this website are to
          provide you with access to content that is restricted from
          public viewing. There may or may not be additional benefits or
          privileges to membership, and the granting or withdrawal of such
          benefits and privileges are solely at the discretion of the
          website management.
        </p>
        <p class="mb-4 text-sm">
          Therefore, your use of a free, or purchased membership at this
          website may come with benefits and privileges that are shown on
          the Subscriptions page.
        </p>
        <p class="mb-4 text-sm">
          <b>Forum Privileges and Membership:</b> Abuse of forum
          guidelines may result in the termination of a Member’s forum
          posting privileges, and in some cases, termination of all
          membership privileges.
        </p>
        <p class="mb-4 text-sm">
          These benefits and privileges may change from time to time, and
          they may change during the course of your membership term. If
          these changes occur during the course of your membership term,
          and you are unsatisfied with the changes (including termination
          of your forum membership and/or other member privileges), you
          are entitled to a full refund of your membership fee by
          contacting support.
        </p>
        <p class="mb-4 text-sm">
          <b>Web Scraping and Automated Scripted Browsing.</b> While we
          acknowledge the legality of web scraping as a technological
          right for publicly available data, these terms and conditions
          prohibit web scraping, automated scripted browsing (where an
          automated script performs actions that include link clicking,
          button clicking, form filling, and other user browsing behaviors
          beyond "reading") is prohibited by logged-in users including
          members because these technologies (a) negatively impact server
          performance and (b) can be used to maliciously alter
          user-generated data on the site. Detection of behavior is
          grounds for immediate termination of your membership account
          without due process.
        </p>
      </section>

      <!-- Subscription Refund and Renewal Policy -->
      <section
        id="subscription-refund-policy"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Subscription Refund and Renewal Policy
        </p>
        <p class="mb-4 text-sm">
          Electronic subscription licenses are treated like software
          licenses. As such, we do not offer returns for electronic
          subscriptions because of the high incidence of piracy and
          copyright abuse. Consequently, please be sure to review site
          content to make sure that you feel that site membership is worth
          the subscription fee.
        </p>
        <p class="mb-4 text-sm">
          Access to Gear Closet is available using any current, free,
          browser software, on Windows, Linux, and Mac platforms.
          Inability to access GearCloset.com because of failure to upgrade
          current browser software to what is freely available does not
          constitute grounds for a subscription refund.
        </p>
      </section>

      <!-- Fraud Management Policies -->
      <section
        id="fraud-management"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Fraud Management Policies
        </p>
        <p class="mb-4 text-sm">
          Gear Closet uses fraud detection software that automatically
          flags suspect transactions. Every transaction is assigned a
          fraud potential score based on the following criteria:
        </p>
        <ul class="mb-2">
          <li>
            <p class="mb-4 text-sm">
              An AVS match of the cardholder's billing address and zip
              code;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              A CSC/CVC match against the credit card;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              A transaction history of the user that flags multiple
              declined credit card transaction attempts with incorrect
              credit card numbers;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              High quantity line item orders;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Order history and frequency;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Mismatched billing and shipping addresses;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              International orders;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Open or closed proxy server access to our Website;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Client IP location resolution vs. the cardholder billing
              city and zip;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Known countries with high incidence of fraud (e.g.,
              Indonesia, Nigeria, Eastern Europe), as well as known postal
              codes within all countries from which a high incidence of
              fraud is known to originate (based on U.S. fraud tracking
              databases).
            </p>
          </li>
        </ul>
        <p class="mb-4 text-sm">
          If one of the above criteria do not match (especially the
          AVS/CSC/CVC), and/or the fraud score indicates a high potential
          for fraud, we may contact you <u>by telephone</u> (this is why a
          valid telephone number is required for all orders) for the
          purpose of:
        </p>
        <ol class="mb-2">
          <li>
            <p class="mb-4 text-sm">
              Confirm your cardholder billing information and CSC/CVC
              codes, or to ask you other questions about your order;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              Ask for the name and telephone number of the issuing bank of
              your credit card so we can call them and confirm the
              authenticity of the transaction.
            </p>
          </li>
        </ol>
        <p class="mb-4 text-sm">
          <b>What do we do when we suspect a fraudulent transaction?</b>
          If we fail to contact you because you left an invalid phone
          number, or we were unable to confirm transaction authenticity
          with the issuing bank, your order will not be dispatched and
          your order will be canceled.
        </p>
        <p class="mb-4 text-sm">
          If we receive a "Notice of Fraudulent Transaction" or a
          "Chargeback Request" (related to a suspected fraudulent
          transaction) from our transaction processor, we work with the
          transaction processor to ensure that the true cardholder is
          reimbursed within 24 hours by reversing their transaction.
          Second, we automatically file a "Report of Suspected Credit Card
          Fraud" with the local law enforcement intelligence jurisdictions
          (including local and state authorities) for the following
          localities: cardholder billing address (if known), shipping
          address of order, and claimed billing address of order. In
          addition, we file these reports with our transaction processor
          (Merchant Service Bank) and the Federal Bureau of Investigation
          (FBI) Internet Fraud Division. For transactions originating from
          both open and closed proxies with international Client IP
          Addresses, or international shipping addresses, we submit the
          reports to the appropriate government law enforcement
          authorities.
        </p>
        <p class="mb-4 text-sm">
          We block user accounts and IP addresses (whether open or closed
          proxy) in cases where confirmed fraudulent transactions are
          originating from those accounts or IP addresses or IP address
          ranges. These are not subject to appeal. If you have an Internet
          Service Provider that is known for hosting fraudulent
          transactions at GearCloset.com, then we’ll block it from
          accessing the GearCloset.com Website. In this case, the
          customer’s only solution is to change Internet Service
          Providers.
        </p>
      </section>

      <!-- Security Statement -->
      <section
        id="security-statement"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Security Statement
        </p>
        <p class="mb-4 text-sm">
          Information that you enter online through GearCloset.com’s order
          gateway will be transferred via the Secure Sockets Layer (SSL)
          protocol to an encrypted server to ensure that your personal
          information is safe.
          <a
            href="https://www.geocerts.com/ssl-checker"
            rel="noopener noreferrer"
            target="_blank">Click here</a>
          to validate our security certificate.
        </p>
      </section>

      <!-- Chat/Message Boards Policy -->
      <section
        id="chat-message-board-policy"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Chat/Message Boards
        </p>
        <p class="mb-4 text-sm">
          By participating in a chat room or message board hosted at this
          domain, you automatically agree to all of the rules governing
          your use as provided below. We may revise these terms from time
          to time. If you continue to participate in a chat/message board
          after we post changes to these terms and conditions, it will
          mean that you accept those changes.
        </p>
        <p class="mb-4 text-sm">
          Gear Closet reserves the right to remove for any reason posted
          materials from a chat/message board, and the right to deny in
          its sole discretion any user access to a chat/message board,
          without notice. This includes the following: not identifying
          yourself with your real name in your forum profile or posting
          with two or more forum identities. you are a real person, as are
          the people with whom you are communicating. Please confer the
          simple respect and trust that comes with communications that is
          not veiled behind anonymity.
        </p>
        <p class="mb-4 text-sm">
          While "censorship" sounds like a dirty word, you need to
          understand that by participating in our forums, you are agreeing
          to allow us to exercise our discretion in deciding whether to
          allow your messages to remain publicly viewable. It is important
          to us that we maintain a certain level of decency and
          courteousness, and if we do not view your message as decent,
          courteous, or otherwise appropriate, it will be removed from
          public view. If improper behavior becomes a pattern, Gear Closet
          reserves the right to block message posting and/or reading
          privileges, and flagging/labeling the user account with
          information for the public to view so that other Website users
          can evaluate the tendencies of this user to post inappropriate
          information. We thank you in advance for your understanding and
          your cooperation in maintaining the integrity of our website.
        </p>
        <p class="mb-4 text-sm">
          You agree not to submit, upload or post to a chat/message board
          any content which:
        </p>
        <ol class="mb-2">
          <li>
            <p class="mb-4 text-sm">
              libels, defames, invades privacy, or is obscene, profane,
              pornographic, abusive, or threatening;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              infringes any intellectual property or other right of any
              person or entity, including but not limited to, violating
              anyone's copyrights or trademarks;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              falsifies or deletes author attributions, legal notices or
              other proprietary designations;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              violates any law;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              advocates illegal activity;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              knowingly contains viruses, corrupted files, or other
              materials that may cause damage to another's computer; or;
            </p>
          </li>
          <li>
            <p class="mb-4 text-sm">
              advertises or otherwise solicits funds or sales of goods or
              services.
            </p>
          </li>
        </ol>
        <p class="mb-4 text-sm">
          Please visit the
          <nuxt-link to="/forums/guidelines">
            Forum Guidelines
          </nuxt-link> for
          additional guidelines regarding forum behavior.
        </p>
        <p class="mb-4 text-sm">
          The information and opinions expressed in materials posted by
          chat/message board participants are not necessarily those of
          Gear Closet, and we make no representations or warranties
          regarding such posted materials. Participants should be aware
          that our chat/message boards are public, not private
          communications. When you voluntarily disclose personal
          information on a chat/message board, that information can be
          collected and used by others and may result in unsolicited
          messages from other people.
        </p>
        <p class="mb-4 text-sm">
          By posting any content on a chat/message board, you
          automatically agree to indemnify Gear Closet, all other
          chat/message board participants, and any other person or entity
          affiliated with the chat/message board, from and against any and
          all third party claims, demands, liabilities, costs or expenses,
          including reasonable attorneys’ fees, resulting from your breach
          of these posting restrictions. By posting on a chat/message
          board any content authored or owned by you, you automatically
          (a) grant to all other chat/message board participants, and any
          other person or entity affiliated with the chat/message board, a
          perpetual, royalty-free, irrevocable and unrestricted worldwide
          right and license to use, reproduce, and distribute the posted
          content for the limited purposes of discussion and commentary,
          (b) grant to Gear Closet a perpetual, royalty-free, irrevocable
          and unrestricted worldwide right and license to use, reproduce,
          modify, adapt, publish, translate, create derivative works from
          and distribute the posted content or incorporate the posted
          content into any form, medium, or technology now known or later
          developed, and (c) waive all "moral rights" with respect to the
          posted content.
        </p>
        <p class="mb-4 text-sm">
          Gear Closet complies with the provisions of the Digital
          Millennium Copyright Act of 1998, 17 U.S.C. Sec. 512. Pursuant
          to that Act, Gear Closet will promptly remove posted materials
          in the event a copyright owner provides proper notification to
          us alleging that the posted materials constitute infringement.
          If your postings are removed under this procedure, we will
          notify you and provide the opportunity for response as provided
          under the Act.
        </p>
        <p class="mb-4 text-sm">
          Any time you post a comment or a Review at Gear Closet in the
          forums, about a product or service for which you have a vested
          material interest or a commercial involvement, you must disclose
          the nature of that relationship in that posting, in accordance
          with FTC Part 255: "Guides concerning the use of endorsements
          and testimonials in advertising".
        </p>
      </section>

      <!-- Privacy Policy -->
      <section
        id="privacy-policy"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Privacy Policy
        </p>
        <p class="mb-4 text-sm">
          Your personal information is not released to third parties
          without your express consent.
        </p>
        <p class="mb-4 text-sm">
          <b>Our Commitment to Privacy. </b>Our Privacy Policy was
          developed as an extension of our commitment to combine quality
          products and services with integrity in dealing with our users.
          The Policy is designed to assist you in understanding how we
          collect, use and safeguard the personal information you provide
          to us and to assist you in making informed decisions when using
          our site and our products and services.
        </p>
        <p class="mb-4 text-sm">
          <b>What Information Do We Collect? </b>When you visit our site
          you may provide us with two types of information: personal
          information you actively choose to disclose ("Active
          Information"), and use information collected, in a way not
          visible to you, on an aggregate anonymous basis as you and
          others browse our site ("Passive Information").
        </p>
        <p class="mb-4 text-sm">
          <b>No Use of Our Site by Persons Under 13. </b>While we
          recognize that persons under 13 years of age may browse this
          Website, no person under 13 should disclose information on this
          site in chat rooms, forums, or other unrestricted areas where
          "client" communications is available. You may learn more about
          protecting children’s privacy online by visiting
          <a href="http://www.ftc.gov/kidzprivacy/">http://www.ftc.gov/kidzprivacy/</a>.
        </p>
        <p class="mb-4 text-sm">
          <b>Active Information You Choose To Provide</b>You are free to
          browse the site without disclosing personal information to us.
          In order to gain use of some sections of the site and gain
          access to premium content (i.e., become a "user"), or a
          contributing (posting) forum member, we may ask you to disclose
          the following information: first and last name, company name,
          job title, mailing address, email address, daytime telephone
          number, and keywords that best describe your profession.
          Contributing (posting) in our forums requires that you maintain
          an active, valid email address and real first and last names in
          your user profile. If you elect not to do so, your login and/or
          posting privileges may be suspended.
        </p>
        <p class="mb-4 text-sm">
          If you choose to participate in our community forums, your first
          and last names will be associated with your post. We discourage
          anonymity and encourage integrity in your communications so that
          your identity fairly reflects your reputation for appropriate
          communications.
        </p>
        <p class="mb-4 text-sm">
          If you choose to post information on our site or maintain email,
          snail mail or telephone contact with us, we may retain such
          information also.
        </p>
        <p class="mb-4 text-sm">
          <b>Passive Information Collected. </b>Our site utilizes a
          standard technology called "cookies" to collect information
          about how our site is used. Passive Information gathered may
          include the date and time of visits, the site pages viewed, time
          spent at our site, the sites visited just before and just after
          our site. Passive Information is collected on an aggregate basis
          without any association to your personal information so that you
          remain anonymous. This site uses only "temporary" cookies that
          are removed from your computer immediately after you leave the
          site. We do not use "user cookies" stored on your hard disk and
          used to track your site use activity on subsequent visits
          intended to be anonymous. If you do not wish to transmit
          "cookie" information about yourself, you may turn off the cookie
          function in your web browser; please consult the "Help" section
          of your browser to correctly do so. Some of the passive
          information that we collect includes domain names, IP addresses,
          page visit statistics, and session variables.
        </p>
        <p class="mb-4 text-sm">
          <b>What is a Cookie? </b>Cookies are a feature of web browser
          software (Internet Explorer, Netscape Navigator, etc.) that
          allows web servers to recognize the computer used to access a
          site. They are small pieces of data that are stored by a user’s
          web browser on one site and can simplify subsequent interactions
          with that site by the same user or to use the information to
          streamline the user’s transaction on related web pages. This
          makes it easier for a user to move from site to site and to
          complete transactions over the Internet. Cookies should make
          your online experience easier and more personalized.
        </p>
        <p class="mb-4 text-sm">
          <b>How Do We Use the Information Collected? </b>Broadly
          speaking, persons we employ directly, or as contractors or
          agents at our direction, use Active Information for purposes of
          administering our business activities, providing customer
          services such as support, and making available other products or
          services we think may be of interest to our users. We may use
          the Active Information or Passive Information you provide to us
          to contact you about changes to our site, new services, features
          or products we offer, or other information we think you shall
          find valuable. If at any time you do not wish to receive such
          information, please send us an email and we will promptly remove
          you from the appropriate distribution lists.
        </p>
        <p class="mb-4 text-sm">
          We use Passive Information to gather information about our users
          and to enhance and design our site to make it easier, faster and
          friendlier to use. Additionally, cookies help us know
          information about how many people visit our site, when they
          visit and how they use our service. We do not connect any of
          this information to your personal information or email address.*
          However, Passive Information may result in your viewing of
          particular content based on your user habits for your viewing on
          our site.
        </p>
        <p class="mb-4 text-sm">
          *The exception to this occurs when we are attempting to
          correlate user accounts with IP addresses when users are
          violating this Terms and Conditions of Use Agreement, or on an
          as-needed basis for troubleshooting technical problems of
          Website usage.
        </p>
        <p class="mb-4 text-sm">
          <b>Your Information In Relation to Others We Link To. </b>You
          may be able to access other websites through our site. When you
          do so you are doing so subject to their policies regarding
          privacy and data collection and you should read those sites’
          privacy policies to make sure you agree to them before using
          such sites. When you choose to shop at such sites, you should
          read their privacy policies to make sure you agree to them
          before making purchases.
        </p>
        <p class="mb-4 text-sm">
          <b>
            Sharing Information With Advertisers or Other Third Parties.
          </b>
          We may disclose anonymous information about user habits,
          characteristics and user patterns, based on aggregate user
          statistics to third parties, including manufacturers submitting
          product reviews, sponsors for our donation and grant programs,
          or the press. We do NOT sell or otherwise share your personal
          information with direct marketing companies or brokers.
        </p>
        <p class="mb-4 text-sm">
          <b>
            Sharing Information With the Government or As Otherwise
            Requested by Law.
          </b>
          We may be required by law or government agency to disclose both
          Active and Passive Information you have provided to us.
        </p>
        <p class="mb-4 text-sm">
          <b>
            How Do We Secure Active Information and Passive Information?
          </b>
          We secure your personal information submitted by you by using
          reasonable efforts to prevent unauthorized access or disclosure,
          or accidental loss or destruction of Active Information and
          Passive Information. Your postings on this site and other
          communications you may have with us via email or snail mail may
          not be secure unless we advise you that security measures are in
          place prior to your sending information. Therefore, if you
          choose to communicate with us through these means, you are
          assuming the risk of doing so and we request that you do not
          send or post sensitive information through these means.
        </p>
        <p class="mb-4 text-sm">
          <b>
            How You Can Choose Not To Receive Information About Products
            or Services By Us, or to Correct, Delete or Access Your
            Information.
          </b>
          If you desire not to receive information about products or
          services we think may be of interest to you or if you wish to
          access, delete or correct your information, you can opt out and
          otherwise manage your account using the appropriate links in
          emails that we send to you. We reserve the right to revise this
          policy at our discretion. Please check back on this site as this
          policy may be revised from time to time without notice to you.
        </p>
      </section>

      <!-- Disclosure -->
      <section
        id="disclosure"
        class="my-12">
        <p class="font-bold text-base uppercase">
          Disclosure
        </p>
        <p class="mb-4 text-sm">
          Gear Closet receives income from advertising and affiliate
          relationships. In the case of advertiser-purchased "sponsored
          content", Gear Closet will clearly disclose the nature of the
          sponsorship whenever that content is published at
          GearCloset.com, in our email blasts, or on our social media
          channels.
        </p>
        <p class="mb-4 text-sm">
          In addition, some links to merchants published by Gear Closet
          are "affiliate links". If you click on one of these links and
          subsequently make a purchase at that merchant’s website, we may
          receive a small commission on your order.
        </p>
        <p class="mb-4 text-sm">
          Gear Closet reserves the right to edit forum posts for the
          purpose of improving search engine optimization of keywords of
          interest to the community. Examples of this type of editing
          include adding a brand name before a product name, correcting a
          misspelled industry term (e.g., trap &gt; tarp), or
          automatically linking certain keywords in user posting to
          products at retailer websites (affiliate links).
        </p>
        <p class="mb-4 text-sm">
          The Terms Of Use for this website require you to allow
          advertisements on this website to load. We understand that
          annoying ads are intrusive and we do our best to adhere to best
          industry practices and ethics when it comes to serving ads.
          Therefore, we kindly request that you disable your ad blockers
          or whitelist GearCloset.com in your ad blocking software we’d be
          grateful for that.
        </p>
      </section>
    </div>
  </div>
  <scroll-to-top />
</template>

