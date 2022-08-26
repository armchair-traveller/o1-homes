// seed fauna GraphQL database with mock data
import { createClient, fetchExchange, gql } from '@urql/svelte'
// Note: Mock data was generated using Mockaroo. Might use faker.js in the future if I knew I was going to need to end up
// writing a Node script beforehand.
import homes from './mock-homes.json' assert { type: 'json' }

// Could be server, or w/e you want that has write access to Fauna
const WRITE_KEY = 'YOUR_FAUNA_SERVER_KEY' // TODO: change this to your Fauna key temporarily to seed. DO NOT COMMIT THIS FILE TO GIT

const client = createClient({
  url: 'https://graphql.fauna.com/graphql',
  exchanges: [fetchExchange],
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${WRITE_KEY}`,
    },
  },
})

let i = 0 // for unique IDs when aliasing queries in homeToMutation
const promises = []

console.log('seeding fauna with mock data')
const step = 100 // how many homes to write at a time. 100 is a good number. 1000 triggered an instance is not unique error
for (let i = 0; i < homes.length; i += step) {
  // logic may be refined, b/c I only got 900/1000 homes were written (or a uniqueness constraint error may have happened).
  // But doesn't matter for mock data
  const batch = homes.slice(i, i + step)
  const query = gql`
mutation SeedData {
${batch.reduce((acc, home) => acc + homeToMutation(home), '')}
}`
  promises.push(client.mutation(query).toPromise())
}

await Promise.allSettled(promises)
console.log('done. Check if data is in Fauna')

// string interpolate into a GraphQL mutation
// writing this took no time at all. Copilot is amazing. So many times it saved me from writing a bunch of boilerplate,
// and I can just focus on the logic. I might have to write a blog post about it.
function homeToMutation(home) {
  return `
  home${i++}: createHome(
    data: {
      property: {
        create: {
          address: {
            create: {
              addressLine1: "${home.property.address.addressLine1}"
              city: "${home.property.address.city}"
              state: "${home.property.address.state}"
              zip: "${home.property.address.zip}"
            }
          }
          propertyType: ${home.property.propertyType}
          squareFeet: ${home.property.squareFeet}
          numberBedrooms: ${home.property.numberBedrooms}
          numberBaths: ${home.property.numberBaths}
          description: "${home.property.description}"
          primaryOwner: {
            create: {
              firstName: "${home.property.primaryOwner.firstName}"
              lastName: "${home.property.primaryOwner.lastName}"
              email: "${home.property.primaryOwner.email}"
              status: ${home.property.primaryOwner.status}
            }
          }
          ownerType: ${home.property.ownerType}
          primaryImageUrl: "${home.property.primaryImageUrl}"
        }
      }
      state: ${home.state}
      price: ${home.price}
      escrowCompany: {
        create: {
          name: "${home.escrowCompany.name}"
          officerName: "${home.escrowCompany.officerName}"
          type: ${home.escrowCompany.type}
          address: {
            create: {
              addressLine1: "${home.escrowCompany.address.addressLine1}"
              city: "${home.escrowCompany.address.city}"
              state: "${home.escrowCompany.address.state}"
              zip: "${home.escrowCompany.address.zip}"
            }
          }
        }
      }
      titleCompany: {
        create: {
          name: "${home.titleCompany.name}"
          officerName: "${home.titleCompany.officerName}"
          type: ${home.titleCompany.type}
          address: {
            create: {
              addressLine1: "${home.titleCompany.address.addressLine1}"
              city: "${home.titleCompany.address.city}"
              state: "${home.titleCompany.address.state}"
              zip: "${home.titleCompany.address.zip}"
            }
          }
        }
      }
      listingAgent: {
        create: {
          licenseNumber: "${home.listingAgent.licenseNumber}"
          licenseState: "${home.listingAgent.licenseState}"
          status: ${home.listingAgent.status}
          user: {
            create: {
              firstName: "${home.listingAgent.user.firstName}"
              lastName: "${home.listingAgent.user.lastName}"
              email: "${home.listingAgent.user.email}"
              status: ${home.listingAgent.user.status}
            }
          }
        }
      }
      includedItems: { create: ${
        JSON.stringify(home.includedItems).replace(/"([^"]+)":/g, '$1:') // .replace is for removing quotes around keys in JSON. GraphQL doesn't like them.
        // credit to https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
      } }
      excludedItems: { create: ${JSON.stringify(home.excludedItems).replace(/"([^"]+)":/g, '$1:')} }
    }
  ) {
    _id
  }`
}
