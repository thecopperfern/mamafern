import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface CustomerCreateResponse {
  customerCreate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    customerUserErrors: {
      code: string;
      field: string[];
      message: string;
    }[];
  };
}

export interface CustomerUpdateResponse {
  customerUpdate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    customerUserErrors: {
      code: string;
      field: string[];
      message: string;
    }[];
  };
}

export interface CustomerResponse {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ImageNode {
  node: {
    url: string | StaticImport;
    altText: string | null;
  };
}

export interface ImageEdges {
  edges: ImageNode[];
}

// Plausible Analytics type definitions
declare global {
  interface Window {
    plausible?: {
      (...args: unknown[]): void;
      q?: unknown[];
      init?: (options?: Record<string, unknown>) => void;
      o?: Record<string, unknown>;
    };
  }
}
