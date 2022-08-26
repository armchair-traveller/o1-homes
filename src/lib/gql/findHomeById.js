import { gql } from '@urql/svelte'

export const findHomeById = gql`
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
`
