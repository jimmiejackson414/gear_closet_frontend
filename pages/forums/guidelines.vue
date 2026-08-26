<script lang='ts' setup>
  definePageMeta({ colorMode: 'light', layout: 'public-layout' });

  useHead({
    meta: [
      {
        content: 'Community guidelines for the Gear Closet forums.',
        name: 'description',
      },
    ],
    title: 'Forum Guidelines',
  });
</script>

<template>
  <div class="flex justify-center mt-14">
    <div class="md:mx-auto w-full md:max-w-4xl">
      <typography
        class="mb-4 text-center"
        variant="h3">
        Forum Guidelines
      </typography>
      <typography
        class="mb-8"
        variant="muted">
        The Gear Closet forums are a paid-member space for trip talk, gear
        advice, and looking out for one another on trail. Using the community
        means you also accept the
        <nuxt-link
          class="text-primary hover:underline"
          to="/terms-and-conditions">
          Terms and Conditions
        </nuxt-link>.
      </typography>

      <section class="my-12">
        <typography class="font-bold uppercase">
          Who can post
        </typography>
        <typography
          class="mb-4"
          variant="muted">
          Anyone can read these guidelines. Starting threads and posting
          replies is a paid membership perk. Free accounts can preview the
          community from the dashboard and upgrade from Profile → Subscription.
        </typography>
      </section>

      <section class="my-12">
        <typography class="font-bold uppercase">
          Be useful on trail
        </typography>
        <typography
          class="mb-4"
          variant="muted">
          Stay on backpacking, gear, trip planning, and related outdoor
          topics. Share what you know, credit other people’s work, and be
          honest about conditions and risk. Advice here is not a substitute
          for your own judgment outdoors.
        </typography>
      </section>

      <section class="my-12">
        <typography class="font-bold uppercase">
          Be decent
        </typography>
        <typography
          class="mb-4"
          variant="muted">
          No harassment, hate, or personal attacks. Do not post anyone’s
          private information. Assume good intent, and leave room for
          different kits and experience levels.
        </typography>
      </section>

      <section class="my-12">
        <typography class="font-bold uppercase">
          No spam or scams
        </typography>
        <typography
          class="mb-4"
          variant="muted">
          Do not advertise, solicit funds, or run affiliate dumps. Lightly
          used gear posts belong in the marketplace category when it exists.
          Do not post malware, phishing, or anything illegal.
        </typography>
      </section>

      <section class="my-12">
        <typography class="font-bold uppercase">
          Enforcement
        </typography>
        <typography
          class="mb-4"
          variant="muted">
          Breaking these guidelines can mean a warning, lost posting
          privileges, or losing membership access. Gear Closet does not
          endorse every post, and public threads can be read by other
          people.
        </typography>
      </section>
    </div>
  </div>
</template>
