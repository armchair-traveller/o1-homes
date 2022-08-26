# [O1 Homes](https://o1homes.netlify.app/)

This is a nifty MVP housing app. It's fully responsive and works on mobile devices.

## App Architecture

- App is built with JAM stack methodology. This means that the app is a static site that is generated at build time and served from a CDN. It is decoupled from the backend and the backend only serves as an API.
- Components belonging to a page will be placed in the same folder in `src/routes`
- Pages are `+page.svelte` (this is how it works in Kit)
- Shared components are in `src/lib/components`
- Aliasing is used when possible to keep the file structure clean. e.g. `$lib/components/Button.svelte` instead of `../../../../lib/components/Button.svelte`

## Preface/Fundamentals

All of these are covered in Svelte docs.

- If you're confused that there's seemingly no `useState`, it's because all variables (`let`/`var`) are reactive by default in Svelte components. This is a huge win for simplicity. You can read more about it [here](https://svelte.dev/tutorial/reactive-declarations).
- Directives in templates:
  - `#each` is React's `.map` for rendering multiple items in an array [EXAMPLE](https://github.com/armchair-traveller/o1-homes/blob/2e2f033cc77b5307e52fd5a62f788477a9278909/src/routes/%2Bpage.svelte#L76-L88)
  - `#if` is conditional rendering [EXAMPLE](https://github.com/armchair-traveller/o1-homes/blob/2e2f033cc77b5307e52fd5a62f788477a9278909/src/routes/home/%5Bid%5D/HomeDetails.svelte#L73-L76)
  - `bind:value` is React's `onChange`/`value` binding to a variable for input elements (but two-way data flow. Of course you can use one-way, too. It is just more verbose.) [EXAMPLE](https://github.com/armchair-traveller/o1-homes/blob/859a9c06b4eced26a4254de4813487d85b8dfb58/src/routes/Filters.svelte#L99-L107)
- $: is a reactive statement. It's like `useEffect` in React. [EXAMPLE](https://github.com/armchair-traveller/o1-homes/blob/859a9c06b4eced26a4254de4813487d85b8dfb58/src/routes/Filters.svelte#L30-L34)

## Design methodology

- As this is a frontend app with an MVP focus, minimal design work was put in. There was no plan but the goal was to make the app look nice enough for consumers (while fitting the brand) and fulfill the requirements.

**Why isn't all data displayed on any home details page?**

- This is for realistic reasons. You wouldn't want to overwhelm a consumer with too much information. The goal is to get them to contact you to get more information. The more information you give them, the less likely they are to contact you. This is a common practice in the real estate industry. You can see this in action on Zillow, Trulia, etc. They don't show all the details on the home details page. They show the basics and then you have to contact them to get more information.
- Pyschology aside, typically owner, escrow, and title info isn't displayed for various reasons I can guess. That would be based on an assumption, and would need some confirmation but I think it's safe to start this way when others in the industry do the same.

## Requirements

- [x] View/browse all available homes
- [x] Filter homes by City, Price, Number of Bedrooms
- [x] Show detailed view for a selected home

**EXTRA**

- Mock data used for backend sourced from Mockaroo and Craiyon
- Errors/loading states handled where applicable

**BEYOND MVP: About**

There're a lot of things that can be done to improve the app, even without extending its functionality as per requirements. I did half of the things I wanted to do on the backend, but they're incomplete and never made it in. They were primarily done on the second day (frontend+mock without DB was done by the first, see commits & deploy in frontend-mock branch which only had sparse fixes). `src/lib/gql/fauna/setup.fql` has incomplete/planned work, and none of it was used to setup the database. Only check if you're interested, but better to just let me explain them if you're curious and want to save time.

## Resources

- [Svelte Docs](https://svelte.dev/docs)
- [Svelte Kit Docs](https://kit.svelte.dev/docs)
- [React Hooks in Svelte](https://github.com/joshnuss/react-hooks-in-svelte)

Backend resources not mentioned because they're not the focus of this MVP.

## On testing

I opted not to because according to the scenario it is an MVP and when you're tight on time for such a simple thing, manual testing scenarios are typically the go-to. Plus there is no indication of the critical parts to test for. I would add tests if I had more time. Playwright for e2e or [Svelte testing library](https://testing-library.com/docs/svelte-testing-library/intro/) (the [React testing library](https://testing-library.com/docs/react-testing-library/intro/) equivalent for Svelte)

- Make no mistake, an MVP still needs to catch bugs. It's just that the scope is smaller and the time to fix is shorter. It's not a reason to not test. However, we can fend off most issues with manual testing & observability. I would still install Sentry to address/log errors in prod, some sort of analytics, and LogRocket to make sure we iron out issues that can't be predicted by testing (you would have to do this even without tests).

## How would I extend this?

While the requirements were an MVP, it is decoupled, globally distributed/consistent, and could handle 10 million users, no sweat or maintenance required. Building on top of this base wouldn't be an issue, as there weren't any major shortcuts taken. However, a few things I would work on if I had more time and I knew I would be able to see it in production:

1. Sentry for error logging/observability
2. LogRocket for session replay
3. Backend-level autocomplete city search, filter price range, filtering by bedroom. Right now, that's all done on the client-side (but it is fine for an MVP. Just not optimal if dataset is huge).
4. GraphQL Codegen to automate generating type conveniences with the API (or type checking via JSDoc or TypeScript)
5. Time travel debugging (likely a session recording variant)
6. Analytics (Google Analytics, Amplitude, Plausible, etc. Maybe even a privacy-focused one like Fathom)
7. Add more tests (E2E, unit, etc.)

Unless–of course–more critical user features are demanded first. Some of these items are just nice-to-haves. You could think of it as a wishlist and I would prioritize them based on the business needs.

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Note that this project was built on Node v17. While Node v16 will work, it is not recommended as some things may not work as expected (e.g. seed script).

## Building

To create a production version of the app:

```bash
npm run build
```

After of which you can preview the production build with `npm run preview`.

> This specific app uses static adapter as it is frontend focused. There're fullstack adapters available as well. Check out [the docs](https://kit.svelte.dev/docs/adapters) for more info.

## Building out your own database

The gist of it is: create a [Fauna](https://fauna.com/) database and upload the schema in `src/lib/gql/fauna/schema.gql`. Make a server key and then seed the database as per below.

## Seeding data

To seed data, fill in your Fauna API key for `const WRITE_KEY` in `scripts/mock/seed.js`. Run `npm run seed`. It uses Node experimental `fetch` so you will need at least v17.5 to run it. It will seed the data in `mock-homes.json` to the database.

---

Note: Some work has been done in the database for city search autocomplete and range price filtering queries. The queries are imperative and take a while to write/figure out but not to read. And everything needs to be tested to some degree (though quick as it's through shell). They aren't worth the time in an MVP, but I started work on them to get the technical groundwork for how it could be extended, thinking it would be viable if it was 90% done after the second day was over (I started backend work on that day). They never made it in but definitely lots of notes in this codebase (and lots of thoughts in my mind) to talk about.
