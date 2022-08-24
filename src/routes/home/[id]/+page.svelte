<script>
  import { page } from '$app/stores'
  import homes from '../../../homes.json'
  import { priceFormatter } from '$lib/utils/priceFormatter'
  import Check from '~icons/heroicons-solid/check'
  // grab route param from the page store. We can also prerender or use edge SSR but that's overkill for an MVP.
  // feel free to ask the tradeoffs of prerendering vs edge SSR
  const { id } = $page.params
  // find the home by id, destructure the data we need
  const {
    property: {
      primaryImageUrl,
      description,
      address: { addressLine1, city, state, zip },
      numberBedrooms,
      numberBaths,
      squareFeet,
      propertyType,
    },
    price,
    state: listStatus,
    listingAgent,
    includedItems,
    excludedItems,
  } = homes.find((home) => home.id === +id)
  const agentName = `${listingAgent.user.firstName} ${listingAgent.user.lastName}`,
    { email: agentEmail, status: agentStatus, phone: agentPhone } = listingAgent.user,
    address = `${addressLine1}, ${city}, ${state} ${zip}`,
    includedFeatures = includedItems.map(({ name }) => name),
    excludedFeatures = excludedItems.map(({ name }) => name)
</script>

<svelte:head>
  <title>{address}</title>
</svelte:head>

<div class="bg-white">
  <div
    class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8"
  >
    <!-- Home details -->
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
                <strong class="text-black">{numberBedrooms}</strong> bed
              </p>
              <p class="ml-2 text-sm text-gray-500">
                <strong class="text-black">{numberBaths}</strong> bath
              </p>
              <p class="ml-2 text-sm text-gray-500">
                <strong class="text-black">{squareFeet}</strong> sq ft
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-6">
          <p class="text-base text-gray-500">{description}</p>
        </div>

        <div class="mt-6 flex items-center">
          <!-- Use #if directive for conditional rendering in Svelte -->
          {#if listStatus == 'Active'}
            <Check class="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
          {/if}
          <p class="text-sm text-gray-500" class:ml-2={listStatus == 'Active'}>
            <!-- ? There may be better microcopy for describing a listing's state -->
            {listStatus != 'PreSale'
              ? `This listing is currently ${listStatus.toLowerCase()}`
              : 'This home is currently in pre-sale'}
          </p>
        </div>
      </section>
    </div>

    <!-- Home image -->
    <div class="mt-10 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-center">
      <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
        <img
          src={primaryImageUrl}
          alt="Model wearing light green backpack with black canvas straps and front zipper pouch."
          class="w-full h-full object-center object-cover"
        />
      </div>
    </div>

    <!-- Extra info -->
    <div class="mt-10 lg:max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
      <section aria-labelledby="extra-info-heading">
        <h2 id="extra-info-heading" class="sr-only">Extra Info</h2>

        <!-- Agent info -->
        {#if agentStatus == 'Active'}
          <fieldset class="max-w-fit">
            <legend class="block text-sm font-medium text-gray-700">Contact</legend>
            <div class="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="relative block border border-gray-300 rounded-lg p-4 focus:outline-none">
                <p class="text-xs text-gray-500">Listing Agent</p>
                <p class="text-base font-medium text-gray-900">{agentName}</p>
                <a href="mailto:{agentEmail}" class="mt-1 text-sm text-gray-500">
                  {agentEmail}
                </a>
                {#if agentPhone}
                  <p class="text-sm text-gray-500">
                    {agentPhone}
                  </p>
                {/if}
                <div
                  class="absolute -inset-px rounded-lg border-2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </fieldset>
        {/if}
        <h2 class="block text-sm font-medium text-gray-700 mt-4">Facts and features</h2>
        <ul>
          {#if propertyType == 'SingleFamilyHome'}
            <!-- hardcoded b/c this is the only one of its type. Create a record/dict after seeing what other types exist. -->
            <li class="group text-sm text-gray-500">Type: Single Family</li>
          {/if}
          {#if includedFeatures.length}
            <li class="group text-sm text-gray-500">
              Included: {includedFeatures.join(', ')}
            </li>
          {/if}
          {#if excludedFeatures.length}
            <li class="group text-sm text-gray-500">
              Not included: {excludedFeatures.join(', ')}
            </li>
          {/if}
        </ul>

        <div class="mt-10">
          <!-- There's only a single button here, but if this was used at least 3 times I would refactor into a more 
            generic component, adding variants as our design guides us -->
          <button
            type="submit"
            class="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
          >
            Contact agent
          </button>
        </div>
      </section>
    </div>
  </div>
</div>
