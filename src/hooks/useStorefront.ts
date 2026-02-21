import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { GraphQLClient, RequestDocument } from "graphql-request";

let _client: GraphQLClient | null = null;

function getClient(): GraphQLClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SHOPIFY_STORE_API_URL;
  if (!url) {
    throw new Error("Shopify Storefront API URL is not defined");
  }
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Shopify Storefront access token is not defined");
  }
  _client = new GraphQLClient(url, {
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
  });
  return _client;
}

interface QueryVariables {
  query: RequestDocument;
  variables?: Record<string, unknown>;
  enabled?: boolean;
}

interface MutationVariables {
  query: RequestDocument;
  variables: Record<string, unknown>;
}

export function useStorefrontQuery<TData = unknown>(
  queryKey: QueryKey,
  { query, variables, enabled = true, ...options }: QueryVariables
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await getClient().request<TData>(query, variables);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch data from Shopify Storefront API");
      }
    },
    enabled,
    ...options,
  });
}

export function useStorefrontMutation<
  TData = unknown,
  TVariables extends MutationVariables = MutationVariables
>() {
  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn: async ({ query, variables }) => {
      try {
        const response = await getClient().request<TData>(query, variables);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unknown error occurred during mutation");
      }
    },
  });

  return {
    mutate: mutation.mutateAsync,
    mutateSync: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    data: mutation.data,
  };
}
