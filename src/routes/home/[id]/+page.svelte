<script>
  import { page } from '$app/stores'
  import { priceFormatter } from '$lib/utils/priceFormatter'
  import Check from '~icons/heroicons-solid/check'
  import { getContextClient, gql, queryStore } from '@urql/svelte'
  // grab route param from the page store. We can also prerender or use edge SSR but that's overkill for an MVP.
  // feel free to ask the tradeoffs of prerendering vs edge SSR
  const { id } = $page.params

  // same reason to leave this query in as index page component. It's a bit long but it serves only this component for reference.
  const homeStore = queryStore({
    client: getContextClient(),
    query: gql`
      query FindHomeById($id: ID!) {
        result: findHomeByID(id: $id) {
          _id
          price
          state
          listingAgent {
            _id
            user {
              _id
              firstName
              lastName
              email
              phone
              status
            }
          }
          includedItems {
            data {
              _id
              name
            }
          }
          excludedItems {
            data {
              _id
              name
            }
          }
          property {
            primaryImageUrl
            description
            numberBedrooms
            numberBaths
            squareFeet
            propertyType
            address {
              addressLine1
              city
              state
              zip
            }
          }
        }
      }
    `,
    variables: { id },
  })

  $: home = $homeStore.data?.result
  $: address = home
    ? `${home?.property.address.addressLine1}, ${home?.property.address.city}, ${home?.property.address.state} ${home?.property.address.zip}`
    : null

  // Note: Unfortunately destructuring has many more defaults required to make it work since now our data isn't immediately available. There're two approaches to this:
  // 1. take the time to write out all the defaults
  // 2. make do and have components for the inner data (doesn't shorten the total code)
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
            <p class="text-lg text-gray-900 sm:text-xl">{priceFormatter.format(home.price)}</p>

            <div class="ml-4 pl-4 border-l border-gray-300">
              <div class="flex items-center">
                <!-- ? Microcopy could be more descriptive/lengthy for users, but this concise way looks more visually appealing.
              To be honest, Zillow goes even further in shorthanding this.  -->
                <p class="ml-2 text-sm text-gray-500">
                  <strong class="text-black">{home.property.numberBedrooms}</strong> bed
                </p>
                <p class="ml-2 text-sm text-gray-500">
                  <strong class="text-black">{home.property.numberBaths}</strong> bath
                </p>
                <p class="ml-2 text-sm text-gray-500">
                  <strong class="text-black">{home.property.squareFeet}</strong> sq ft
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-6">
            <p class="text-base text-gray-500">{home.property.description}</p>
          </div>

          <div class="mt-6 flex items-center">
            <!-- Use #if directive for conditional rendering in Svelte -->
            {#if home.state == 'ACTIVE'}
              <Check class="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
            {/if}
            <p class="text-sm text-gray-500" class:ml-2={home.state == 'ACTIVE'}>
              <!-- ? There may be better microcopy for describing a listing's state -->
              {home.state != 'PRESALE'
                ? `This listing is currently ${home.state.toLowerCase()}`
                : 'This home is currently in pre-sale'}
            </p>
          </div>
        </section>
      </div>

      <!-- Home image -->
      <div class="mt-10 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-center">
        <div class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
          <img
            src={home.property.primaryImageUrl}
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

          <h2 class="block text-sm font-medium text-gray-700 mt-4">Facts and features</h2>
          <ul>
            <!-- hardcoded b/c this is the only one of its type. Create a record/dict after seeing what other types exist. -->
            <li class="group text-sm text-gray-500">
              Type: {home.property.propertyType
                .toLowerCase()
                .replace(/^_*(.)|_+(.)/g, (s, c, d) =>
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
            <!-- There's only a single button here, but if this was used at least 3 times I would refactor into a more 
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
