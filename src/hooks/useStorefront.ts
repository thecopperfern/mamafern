import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { RequestDocument } from "graphql-request";
import { print } from "graphql";
import { DocumentNode } from "graphql";

/**
 * Client-side Storefront queries go through /api/shopify so the access token
 * never leaves the server. This replaces the previous direct-GraphQLClient
 * approach that exposed the token via NEXT_PUBLIC_ env vars.
 */
async function proxyRequest<TData>(
  query: RequestDocument,
  variables?: Record<string, unknown>
): Promise<TData> {
  const queryString =
    typeof query === "string" ? query : print(query as DocumentNode);

  const res = await fetch("/api/shopify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: queryString, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL proxy error");
  }

  return json.data as TData;
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
        return await proxyRequest<TData>(query, variables);
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
        return await proxyRequest<TData>(query, variables);
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
