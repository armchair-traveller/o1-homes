// TODO unused but generated for reference
export interface home {
  id: number
  property: Property
  state: string
  price: number
  escrowCompany: EscrowCompanyOrTitleCompany
  titleCompany: EscrowCompanyOrTitleCompany
  listingAgent: ListingAgent
  includedItems?: (IncludedItemsEntityOrExcludedItemsEntity | null)[] | null
  excludedItems?: (IncludedItemsEntityOrExcludedItemsEntity1 | null)[] | null
}
export interface Property {
  id: number
  address: Address
  propertyType: string
  squareFeet: number
  numberBedrooms: number
  numberBaths: number
  description: string
  primaryOwner: PrimaryOwner
  ownerType: string
  primaryImageUrl: string
}
export interface Address {
  id: number
  addressLine1: string
  addressLine2?: null
  city: string
  state: string
  zip: string
}
export interface PrimaryOwner {
  id: number
  user: User
}
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: null
  status: string
}
export interface EscrowCompanyOrTitleCompany {
  id: number
  name: string
  phone?: null
  email?: null
  officerName: string
  address: Address
  type: string
}
export interface ListingAgent {
  id: number
  licenseNumber: string
  licenseState: string
  user: User
  status: string
}
export interface IncludedItemsEntityOrExcludedItemsEntity {
  id: number
  name: string
  listing?: null
}
export interface IncludedItemsEntityOrExcludedItemsEntity1 {
  id: number
  name: string
  listing?: null
}
