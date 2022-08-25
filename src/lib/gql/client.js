import { createClient } from '@urql/svelte'

// this is the most basic client. I would normally init in `layout` as it's only used once and so small. There's barely
// anything happening in layout. But modularizing it for safety.
// maybe urqlClient would be less ambiguous, but we only need one client. Needless worry.
export const client = createClient({
  url: 'https://graphql.fauna.com/graphql',
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_FAUNA_KEY}`,
    },
  },
})
