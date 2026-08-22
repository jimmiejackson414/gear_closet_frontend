<script lang='ts' setup>
  definePageMeta({ layout: 'public-layout', colorMode: 'light' });

  useHead({
    title: 'Forum Guidelines',
    meta: [
      {
        name: 'description',
        content: 'Community guidelines for the Gear Closet forums.',
      },
    ],
  });
</script>

<template>
  <div class="flex justify-center mt-14">
    <div class="md:mx-auto w-full md:max-w-4xl">
      <h5 class="mb-4 text-2xl text-center">
        Forum Guidelines
      </h5>
      <p class="mb-8 text-sm">
        The Gear Closet forums are a paid-member space for trip talk, gear
        advice, and looking out for one another on trail. Using the community
        means you also accept the
        <nuxt-link
          class="text-primary hover:underline"
          to="/terms-and-conditions">
          Terms and Conditions
        </nuxt-link>.
      </p>

      <section class="my-12">
        <p class="font-bold text-base uppercase">
          Who can post
        </p>
        <p class="mb-4 text-sm">
          Anyone can read these guidelines. Starting threads and posting
          replies is a paid membership perk. Free accounts can preview the
          community from the dashboard and upgrade from Profile → Subscription.
        </p>
      </section>

      <section class="my-12">
        <p class="font-bold text-base uppercase">
          Be useful on trail
        </p>
        <p class="mb-4 text-sm">
          Stay on backpacking, gear, trip planning, and related outdoor
          topics. Share what you know, credit other people’s work, and be
          honest about conditions and risk. Advice here is not a substitute
          for your own judgment outdoors.
        </p>
      </section>

      <section class="my-12">
        <p class="font-bold text-base uppercase">
          Be decent
        </p>
        <p class="mb-4 text-sm">
          No harassment, hate, or personal attacks. Do not post anyone’s
          private information. Assume good intent, and leave room for
          different kits and experience levels.
        </p>
      </section>

      <section class="my-12">
        <p class="font-bold text-base uppercase">
          No spam or scams
        </p>
        <p class="mb-4 text-sm">
          Do not advertise, solicit funds, or run affiliate dumps. Lightly
          used gear posts belong in the marketplace category when it exists.
          Do not post malware, phishing, or anything illegal.
        </p>
      </section>

      <section class="my-12">
        <p class="font-bold text-base uppercase">
          Enforcement
        </p>
        <p class="mb-4 text-sm">
          Breaking these guidelines can mean a warning, lost posting
          privileges, or losing membership access. Gear Closet does not
          endorse every post, and public threads can be read by other
          people.
        </p>
      </section>
    </div>
  </div>
</template>
