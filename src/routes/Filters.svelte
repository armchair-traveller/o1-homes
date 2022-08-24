<script>
  import FilterIcon from '~icons/heroicons-solid/filter'
  import LocationMarker from '~icons/heroicons-outline/location-marker'
  import { createEventDispatcher } from 'svelte'

  /** cities to filter by, normally would be from an API call */
  export let cities = []

  let hidden = true

  // ? We can definitely use stores to share state across the app, which is like a more primitive/simpler Redux, but it
  //   seems overkill here as the there is not enough state being passed through multiple levels to be called prop drilling.

  // passing up using two-way binding is possible too, but might seem confusing to new devs that have only used React.
  // thus, we'll use `dispatch` to pass up the state changes as an event to the parent component.
  const dispatch = createEventDispatcher() // note: in TS, this can be typed but is quite verbose
  const filtersDefaults = {
    city: '',
    price: {
      min: '',
      max: '',
    },
    bedrooms: '',
  }
  // used to reset the filters
  const copyFiltersDefaults = () => ({ ...filtersDefaults, price: { ...filtersDefaults.price } })
  let filters = copyFiltersDefaults(),
    numFilters = 0

  // $: is a reactive statement. It will run whenever the value of the variable changes. It's like useEffect in React.
  // it is automagically memoized by the compiler. If the value of the variable does not change, the statement will not run.
  // we're using it here to validate price and make sure it is positive. Serious validation can use Superstruct/Yep,
  // and a form lib (in React it would be something like Formik).
  $: deps(filters)
  function deps(data) {
    // note that this IS mutating the object. It's intended. This object is just component state.
    if (data.price.min < 0) data.price.min = 1
    if (data.price.min < 0) data.price.max = 1
    if (data.price.max && data.price.min > data.price.max) data.price.max = data.price.min

    // count the number of filters applied
    numFilters = Object.values(data).reduce((acc, val) => {
      if (typeof val === 'object') return acc + Object.values(val).filter(Boolean).length
      return acc + (val ? 1 : 0)
    }, 0)

    // dispatch the filters to the parent component as a custom 'filter' event. You can add an additional variable if you want
    // this ignored on initial mount/render.
    // We can get really fine-grained with the events if we choose to validate, for example choosing not to dispatch
    // when it is invalid or incomplete by using an if statement.
    dispatch('filter', data)
  }
</script>

<section
  aria-labelledby="filter-heading"
  class="relative z-10 border-t border-b border-gray-200 grid items-center"
>
  <h2 id="filter-heading" class="sr-only">Filters</h2>
  <div class="relative col-start-1 row-start-1 py-4">
    <div
      class="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8"
    >
      <div>
        <button
          class="group text-gray-700 font-medium flex items-center"
          aria-controls="disclosure-1"
          aria-expanded={!hidden}
          on:click={() => (hidden = !hidden)}
        >
          <FilterIcon
            class="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          {numFilters} Filters
        </button>
      </div>
      <div class="pl-6">
        <!-- reset filters -->
        <button class="text-gray-500" on:click={() => (filters = copyFiltersDefaults())}>
          Clear all
        </button>
      </div>
    </div>
  </div>
  <!-- class:hidden is a shorthand in Svelte that uses the `hidden` variable in our script tag with the class name `hidden`
    on this element, and applies it if truthy  -->
  <div class="border-t border-gray-200 py-10" class:hidden id="disclosure-1">
    <div
      class="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-x-4 px-4 gap-y-4 text-sm sm:px-6 md:gap-x-6 lg:px-8"
    >
      <!-- City Filters -->
      <div>
        <label for="city" class="block text-sm font-medium text-gray-700">City</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm"> <LocationMarker aria-hidden="true" /> </span>
          </div>
          <input
            bind:value={filters.city}
            list="cities"
            type="text"
            name="city"
            id="city"
            class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 pr-4 sm:text-sm border-gray-300 rounded-md"
            placeholder="Los Angeles"
          />
          <datalist id="cities">
            {#each cities as city}
              <option value={city} />
            {/each}
          </datalist>
        </div>
      </div>
      <!-- Price filters -->
      <div class="isolate -space-x-px rounded-md max-w-fit">
        <div class="flex">
          <div>
            <label for="min-price" class="block text-sm font-medium text-gray-700">Min Price</label>
            <div class="mt-1 relative rounded-md rounded-r-none shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm"> $ </span>
              </div>
              <input
                bind:value={filters.price.min}
                type="number"
                step="1"
                name="min-price"
                id="min-price"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-4 sm:text-sm border-gray-300 rounded-md rounded-r-none"
                placeholder="0"
                aria-describedby="price-currency"
              />
            </div>
          </div>
          <div>
            <label for="max-price" class="block text-sm font-medium text-gray-700">Max Price</label>
            <div class="mt-1 relative rounded-md rounded-l-none shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm"> $ </span>
              </div>
              <input
                bind:value={filters.price.max}
                type="number"
                step="1"
                name="max-price"
                id="max-price"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-4 sm:text-sm border-gray-300 rounded-md rounded-l-none"
                placeholder="1000000"
                aria-describedby="price-currency"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Bedrooms filter -->
      <div>
        <label for="bedrooms" class="block text-sm font-medium text-gray-700">
          Number of Bedrooms
        </label>
        <select
          bind:value={filters.bedrooms}
          id="bedrooms"
          name="bedrooms"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="" selected>Any</option>
          <option value="1"> 1 bedroom </option>
          {#each Array.from({ length: 6 - 2 }, (x, i) => i + 2) as value}
            <option {value}>
              {value} bedrooms
            </option>
          {/each}
          <option value="6"> 6+ bedrooms </option>
        </select>
      </div>
    </div>
  </div>
  <!-- ? Additional sort for ascending (alphabetical), newest, price: low to high, price: high to low
  might have been implemented here if there was time -->
</section>

<style>
  /* style tag in Svelte is component-scoped. This means these styles will only apply to this component and won't spill
  onto other elements in the app 
  remove arrows from number input, credit: https://stackoverflow.com/questions/3790935/can-i-hide-the-html5-number-input-s-spin-box */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
  /* remove ugly/misplaced default browser datalist dropdown arrow 
  credit: https://stackoverflow.com/questions/20937475/remove-datalist-dropdown-arrow-in-chrome  */
  [list]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
</style>
