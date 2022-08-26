import { gql } from '@urql/svelte'

export const getAllHomes = gql`
  query GetAllHomes {
    result: getAllHomes {
      data {
        _id
        price
        property {
          _id
          numberBedrooms
          primaryImageUrl
          description
          address {
            _id
            city
          }
        }
      }
    }
  }
`
