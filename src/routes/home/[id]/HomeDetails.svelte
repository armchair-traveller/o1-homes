<script>
  import { findHomeById } from '$lib/gql/findHomeById'
  import { priceFormatter } from '$lib/utils/priceFormatter'
  import { getContextClient, queryStore } from '@urql/svelte'
  import Check from '~icons/heroicons-solid/check'
  import { page } from '$app/stores'

  // this is retrieved from cache if we already used the same query in another component
  const homeStore = queryStore({
    client: getContextClient(),
    query: findHomeById,
    variables: { id: $page.params.id },
  })

  $: ({
    price,
    property: {
      address: { addressLine1, city, state, zip } = {},
      numberBedrooms: beds,
      numberBaths: baths,
      squareFeet: sqft,
      description,
    } = {},
    state: homeState,
  } = $homeStore.data?.result || {})
  $: address = `${addressLine1}, ${city}, ${state} ${zip}`

  function formatHomeState(state) {
    const stateMap = {
      ACTIVE: 'is up for sale',
      PRESALE: 'is up for presale',
      PENDING: 'has an offer pending',
    }
    return `This home ${stateMap[state]}.`
  }
</script>

<div class="lg:max-w-lg lg:self-end">
  <div class="mt-4">
    <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
      {address}
    </h1>
  </div>

  <section aria-labelledby="information-heading" class="mt-4">
    <h2 id="information-heading" class="sr-only">Home information</h2>

    <div class="flex items-center">
      <p class="text-lg text-gray-900 sm:text-xl">{priceFormatter.format(price)}</p>

      <div class="ml-4 pl-4 border-l border-gray-300">
        <div class="flex items-center">
          <!-- ? Microcopy could be more descriptive/lengthy for users, but this concise way looks more visually appealing.
              To be honest, Zillow goes even further in shorthanding this.  -->
          <p class="ml-2 text-sm text-gray-500">
            <strong class="text-black">{beds}</strong> bed
          </p>
          <p class="ml-2 text-sm text-gray-500">
            <strong class="text-black">{baths}</strong> bath
          </p>
          <p class="ml-2 text-sm text-gray-500">
            <strong class="text-black">{sqft}</strong> sq ft
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 space-y-6">
      <p class="text-base text-gray-500">{description}</p>
    </div>

    <div class="mt-6 flex items-center">
      <!-- Use #if directive for conditional rendering in Svelte -->
      {#if homeState == 'ACTIVE'}
        <Check class="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
      {/if}
      <p class="text-sm text-gray-500" class:ml-2={homeState == 'ACTIVE'}>
        <!-- ? There may be better microcopy for describing a listing's state -->
        {formatHomeState(homeState)}
      </p>
    </div>
  </section>
</div>
