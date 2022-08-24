# [O1 - The Housing App](https://o1homes.netlify.app/)

This is for the mock frontend branch of the housing app. Only frontend is done and mock data is used. It's fully responsive and works on mobile devices.

**WIP** STILL SCALING OUT APP. But doc-driven dev will be the way to go

- [ ] TODO Check that colors match brand on all pages including 404 and inputs

## App Architecture

- App is built with JAM stack methodology. This means that the app is a static site that is generated at build time and served from a CDN. It is decoupled from the backend and the backend only serves as an API.
- Components belonging to a page will be placed in the same folder in `src/routes`
- Pages are `+page.svelte` (this is how it works in Kit)
- Shared components are in `src/lib/components`
- Aliasing is used when possible to keep the file structure clean. e.g. `$lib/components/Button.svelte` instead of `../../../../lib/components/Button.svelte`

## Preface/Fundamentals

All of these are covered in docs TODO: Add link to docs. Also see TODO: add link to react hooks in svelte repo

- If you're confused that there's seemingly no `useState`, it's because all variables (`let`/`var`) are reactive by default in Svelte components. This is a huge win for simplicity. TODO: Example link
- Directives in templates:
  - `#each` is React's `.map` for rendering multiple items in an array TODO: Example link
  - `#if` is conditional rendering TODO: Example link
  - `bind:value` is React's `onChange` for input elements (but two-way data flow. Of course you can use one-way, too. It is just more verbose.) TODO: Example link
- $: is a reactive statement. It's like `useEffect` in React. TODO: Example link

## Design methodology

- As this is a frontend development MVP focus, minimal design work was put in. There was no plan but the goal was to make the app look nice enough for consumers (while fitting the brand) and fulfill the requirements.

**Why isn't all data displayed on any home details page?**

- This is for realistic reasons. You wouldn't want to overwhelm a consumer with too much information. The goal is to get them to contact you to get more information. The more information you give them, the less likely they are to contact you. This is a common practice in the real estate industry. You can see this in action on Zillow, Trulia, etc. They don't show all the details on the home details page. They show the basics and then you have to contact them to get more information.
- Pyschology aside, typically owner, escrow, and title info isn't displayed for various reasons I can guess. That would be based on an assumption, and would need some confirmation but I think it's safe to start this way when others in the industry do the same.

## Requirements

- [ ] View/browse all available homes
- [ ] Filter homes by City, Price, Number of Bedrooms
- [ ] Show detailed view for a selected home

## Resources

## On testing

I opted not to because according to the scenario it is an MVP and when you're tight on time for such a simple thing, manual testing scenarios are enough. I'll list some QA checks I did. Plus there is no indication of the critical parts to test for. I would like to add tests if I had more time. I would use Playwright for e2e or [Svelte testing library](https://testing-library.com/docs/svelte-testing-library/intro/) ([React testing library](https://testing-library.com/docs/react-testing-library/intro/) equivalent for Svelte)

- Make no mistake, an MVP still needs to catch bugs. It's just that the scope is smaller and the time to fix is shorter. It's not a reason to not test. However, we can fend off most issues with manual testing & observability. I would still install Sentry to address/log errors in prod, some sort of analytics, and LogRocket to make sure we iron out issues that can't be predicted by testing (you would have to do this even without tests).

## How would I extend this?

While the requirements were an MVP, I built it on a solid foundation that is distributed (performant globally) and scales well (handles 10 million, no sweat) by default. Building on top of this base wouldn't be an issue, as there weren't any major shortcuts taken. However, a few things I would work on if I had more time and I knew I would be able to see it in production:

1. Sentry for error logging/observability
2. LogRocket for session replay
3. GraphQL Codegen to automate generating type conveniences with the API (or type checking via JSDoc or TypeScript)
4. Time travel debugging (likely a session recording one)
5. Analytics (Google Analytics, Amplitude, Plausible, etc.)
6. Add more tests (e2e, unit, etc.)

Unless–of course–more critical user features are demanded first. Some of these items are just nice-to-haves. You could think of it as a wishlist and I would prioritize them based on the business needs.

## QA checks

Bare minimum:

Extra:

- [ ] Can I see the list of properties?

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

After of which you can preview the production build with `npm run preview`.

> This specific app uses static adapter as it is frontend focused. There're fullstack adapters available as well. Check out [the docs](https://kit.svelte.dev/docs/adapters) for more info.
