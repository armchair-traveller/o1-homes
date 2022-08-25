<script>
  import '../app.postcss'
  import Header from '../lib/Header.svelte'
  import Footer from '$lib/Footer.svelte'
  import { setContextClient } from '@urql/svelte'
  import { client } from '$lib/gql/client'

  setContextClient(client)
</script>

<Header />
<slot />
<Footer />
