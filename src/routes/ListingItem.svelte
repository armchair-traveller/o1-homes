<script>
  import { priceFormatter } from '$lib/utils/priceFormatter'
  // expose props by using `export let` as if it's just another variable.
  export let price,
    city,
    bedrooms = 0,
    src,
    alt = '',
    href
</script>

<div class="group relative p-4 border-r border-b border-gray-200 sm:p-6">
  <div class="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
    <img {src} {alt} class="w-full h-full object-center object-cover" />
  </div>
  <div class="pt-10 pb-4 text-center">
    <h3 class="text-sm font-medium text-gray-900">
      <a {href}>
        <span aria-hidden="true" class="absolute inset-0" />
        {priceFormatter.format(price)}
      </a>
    </h3>
    <div class="mt-3 flex flex-col items-center">
      <p class="sr-only">City</p>
      <p class="mt-1 text-sm text-gray-500">{city}</p>
    </div>
    <p class="mt-4 text-sm">
      <strong class="text-base font-medium text-gray-900">{bedrooms}</strong>
      bedroom{bedrooms > 1 ? 's' : ''}
    </p>
  </div>
</div>
