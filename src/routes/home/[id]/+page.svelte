<script>
  import { page } from '$app/stores'
  import { getContextClient, queryStore } from '@urql/svelte'
  import { findHomeById } from '$lib/gql/findHomeById'
  import HomeDetails from './HomeDetails.svelte'

  // grab route param from the page store. We can also prerender or use edge SSR but that's overkill for an MVP.
  // feel free to ask the tradeoffs of prerendering vs edge SSR
  const { id } = $page.params

  // any subsequent query with same variables will be cached, including children components
  const homeStore = queryStore({
    client: getContextClient(),
    query: findHomeById,
    variables: { id },
  })

  $: home = $homeStore.data?.result
  $: address = home
    ? `${home?.property.address.addressLine1}, ${home?.property.address.city}, ${home?.property.address.state} ${home?.property.address.zip}`
    : null
</script>

<svelte:head>
  <title>{address || 'O1 Homes'}</title>
</svelte:head>

{#if $homeStore.fetching}
  <div class="flex justify-center my-10">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
  </div>
{:else if $homeStore.error}
  <div class="flex justify-center my-10">
    <div class="text-red-500">Error: {$homeStore.error.message}</div>
  </div>
{:else}
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8"
    >
      <HomeDetails />
      <!-- Home image -->
      <div class="mt-10 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-center">
        <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
          <img
            src={home.property.primaryImageUrl}
            alt="The home"
            class="w-full h-full object-center object-cover"
          />
        </div>
      </div>

      <div class="mt-10 lg:max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
        <section aria-labelledby="extra-info-heading">
          <h2 id="extra-info-heading" class="sr-only">Extra Info</h2>

          <!-- Agent info -->
          {#if home.listingAgent.user.status == 'ACTIVE'}
            <fieldset class="max-w-fit">
              <legend class="block text-sm font-medium text-gray-700">Contact</legend>
              <div class="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  class="relative block border border-gray-300 rounded-lg p-4 focus:outline-none"
                >
                  <p class="text-xs text-gray-500">Listing Agent</p>
                  <p class="text-base font-medium text-gray-900">
                    {home.listingAgent.user.firstName}
                    {home.listingAgent.user.lastName}
                  </p>
                  <a
                    href="mailto:{home.listingAgent.user.email}"
                    class="mt-1 text-sm text-gray-500"
                  >
                    {home.listingAgent.user.email}
                  </a>
                  {#if home.listingAgent.user.phone}
                    <p class="text-sm text-gray-500">
                      {home.listingAgent.user.phone}
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

          <!-- This block is a good candidate to extract into a component, and screamingSnakeToTitleCase could be a util. 
            But it's able to fit comfortably here without adding to script code. -->
          <h2 class="block text-sm font-medium text-gray-700 mt-4">Facts and features</h2>
          <ul>
            <li class="group text-sm text-gray-500">
              Type: {home.property.propertyType // Screaming snake -> Title case
                .toLowerCase()
                .replace(/^_*(.)|_+(.)/g, (_, c, d) =>
                  c ? c.toUpperCase() : ' ' + d.toUpperCase()
                )}
            </li>
            {#if home.includedItems.data.length}
              <li class="group text-sm text-gray-500">
                Included: {home.includedItems.data.map(({ name }) => name).join(', ')}
              </li>
            {/if}
            {#if home.excludedItems.data.length}
              <li class="group text-sm text-gray-500">
                Not included: {home.excludedItems.data.map(({ name }) => name).join(', ')}
              </li>
            {/if}
          </ul>

          <div class="mt-10">
            <!-- There's only a single button-like anchor here, but if this was used at least 3 times I would refactor into a more 
            generic component, adding variants as our design guides us -->
            <a
              href="mailto:{home.listingAgent.user.email}"
              class="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
            >
              Contact agent
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
{/if}
