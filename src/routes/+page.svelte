<!-- The home page is currently the listing page. -->
<script>
  import Fuse from 'fuse.js'
  import homes from '../homes.json'
  import Filters from './Filters.svelte'
  import ListingGrid from './ListingGrid.svelte'
  import ListingItem from './ListingItem.svelte'

  let filteredHomes = homes

  const fuse = new Fuse(homes, { keys: ['property.address.city'] })
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
    <Filters
      cities={[
        ...new Set(
          homes.map(
            ({
              property: {
                address: { city },
              },
            }) => city
          )
        ),
      ]}
      on:filter={({ detail: data }) => {
        // This is a bit of a hack, searching properties by city would normally be an API call, but we're fuzzy searching with fuse.js client-side for simplicity
        // But the same could be true with price. Bigger datasets would require a server-side solution.
        filteredHomes = (data.city ? fuse.search(data.city).map(({ item }) => item) : homes).filter(
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
      }}
    />
    <ListingGrid>
      <!-- #each equiv `.map` w/ JSX in React e.g. `filteredHomes.map(({id, price, ...rest}) => (<div key={id}>{price}</div>))`,
        the (id) is for keying the item -->
      {#each filteredHomes as { id, price, property: { address: { city }, numberBedrooms: bedrooms, primaryImageUrl: src, description: alt } } (id)}
        <ListingItem href="/home/{id}" {price} {city} {bedrooms} {src} {alt} />
        <!-- Fallback if no items to display -->
      {:else}
        <div class="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">No homes found</h1>
          <p class="mt-4 max-w-xl mx-auto text-base text-gray-500">
            We couldn't find any homes matching your criteria.
          </p>
        </div>
      {/each}
    </ListingGrid>
  </main>
</div>
