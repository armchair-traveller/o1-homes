<!-- The home page is currently the listing page. -->
<script>
  import { getContextClient, queryStore } from '@urql/svelte'
  import Fuse from 'fuse.js'
  import Filters from './Filters.svelte'
  import ListingGrid from './ListingGrid.svelte'
  import ListingItem from './ListingItem.svelte'
  import { getAllHomes } from '$lib/gql/getAllHomes'

  const homesStore = queryStore({
    client: getContextClient(),
    query: getAllHomes,
  })

  $: homesData = $homesStore.data?.result?.data || []
  $: filteredHomes = homesData
  $: fuse = new Fuse(homesData, { keys: ['property.address.city'] })
  $: uniqueCityNames = [
    ...new Set(
      homesData.map(
        ({
          property: {
            address: { city },
          },
        }) => city
      )
    ),
  ]

  function handleFilter({ detail: data }) {
    // This is a bit of a hack, searching properties by city would normally be handled by an API call, whether through
    // a database, or a specialized search like Algolia, Elastic, or TypeSense but we're fuzzy searching with fuse.js
    // client-side for simplicity
    // Bigger datasets would require a server-side solution, and an incomplete implementation with an overview can be
    // found in src/lib/gql/fauna/setup.fql
    filteredHomes = (data.city ? fuse.search(data.city).map(({ item }) => item) : homesData).filter(
      ({ price, property: { numberBedrooms } }) => {
        if (data.price.min && price < data.price.min) return
        if (data.price.max && price > data.price.max) return
        if (
          data.bedrooms &&
          ((data.bedrooms >= 6 && numberBedrooms < 6) || numberBedrooms != data.bedrooms)
        )
          return
        return true
      }
    )
  }
</script>

<svelte:head>
  <title>O1 Homes</title>
</svelte:head>

<div class="bg-white">
  <main class="pb-24">
    <div class="text-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">Discover your next home</h1>
      <p class="mt-4 max-w-xl mx-auto text-base text-gray-500">
        We provide an unmatched selection for property buyers across the country. Our team of
        experts curates the best properties for you.
      </p>
    </div>
    <Filters cities={uniqueCityNames} on:filter={handleFilter} />
    <ListingGrid>
      {#if $homesStore.fetching}
        <!-- Might be jarring UX if data loads too fast, so a delay could help here. -->
        <div class="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">Loading...</h1>
        </div>
      {:else if $homesStore.error}
        <div class="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">Error</h1>
        </div>
      {:else}
        <!-- #each equiv `.map` w/ JSX in React e.g. `filteredHomes.map(({id, price, ...rest}) => (<div key={id}>{price}</div>))`,
          the (id) is for keying the item -->
        {#each filteredHomes as { _id, price, property: { address: { city }, numberBedrooms: bedrooms, primaryImageUrl: src, description: alt } } (_id)}
          <ListingItem href="/home/{_id}" {price} {city} {bedrooms} {src} {alt} />
          <!-- Fallback if no items to display -->
        {:else}
          <div class="text-center py-16 px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">No homes found</h1>
            <p class="mt-4 max-w-xl mx-auto text-base text-gray-500">
              We couldn't find any homes matching your criteria.
            </p>
          </div>
        {/each}
      {/if}
    </ListingGrid>
  </main>
</div>
