import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStorefrontMutation } from "@/hooks/useStorefront";
import { CUSTOMER_ACCESS_TOKEN_CREATE } from "@/graphql/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormProps = {
  setShowRegister: (show: boolean) => void;
};

const Login = ({ setShowRegister }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useStorefrontMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = (await mutate({
        query: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      })) as {
        customerAccessTokenCreate: {
          customerUserErrors: { message: string }[];
          customerAccessToken: { accessToken: string };
        };
      };

      if (response.customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw new Error("Failed to login");
      }

      const { accessToken } = response.customerAccessTokenCreate.customerAccessToken;

      // Set httpOnly cookie via server route (prevents XSS token theft)
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      // Also set a JS-readable flag cookie so client components can check auth state
      document.cookie = `customerAccessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${60 * 60 * 24 * 30}`;

      router.push("/account");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 my-10"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button
            variant="link"
            onClick={() => setShowRegister(true)}
            className="text-sm"
          >
            Don&apos;t have an account? <b>Register</b>
          </Button>
          <Button type="submit" className="w-1/2" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Login;
