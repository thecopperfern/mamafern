import { gql } from "graphql-tag";

export const CUSTOMER_UPDATE = gql`
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders(
    $customerAccessToken: String!
    $first: Int!
    $after: String
    $sortKey: OrderSortKeys
    $reverse: Boolean
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            lineItems(first: 100) {
              nodes {
                currentQuantity
                title
                originalTotalPrice {
                  amount
                  currencyCode
                }
                variant {
                  image {
                    url
                  }
                  product {
                    handle
                  }
                }
              }
            }
            shippingAddress {
              name
              company
              city
              country
              address1
              address2
            }
            totalPrice {
              amount
              currencyCode
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const GET_CUSTOMER = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
    }
  }
`;
