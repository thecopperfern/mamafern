"use client";

import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogOut, Search, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartActions } from "@/lib/atoms/cart";
import { Badge } from "@/components/ui/badge";
import CartSlideout from "../CartSlideout";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)customerAccessToken=([^;]*)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function handleLogout() {
  document.cookie =
    "customerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem("cartId");
  window.location.reload();
}

const DEFAULT_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Moms", href: "/collections/moms" },
  { label: "Dads", href: "/collections/dads" },
  { label: "Kids", href: "/collections/kids" },
  { label: "Accessories", href: "/collections/accessories" },
];

interface NavbarProps {
  collectionLinks?: { label: string; href: string }[];
}

const Navbar = ({ collectionLinks }: NavbarProps) => {
  const NAV_LINKS =
    collectionLinks && collectionLinks.length > 0
      ? [{ label: "Shop", href: "/shop" }, ...collectionLinks]
      : DEFAULT_LINKS;
  const { cart, initializeCart } = useCartActions();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!getTokenFromCookie());
  }, []);

  useEffect(() => {
    if (!cart?.id) {
      initializeCart();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-oat">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className="text-sm font-medium text-charcoal/80 hover:text-fern transition-colors"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-charcoal hover:text-fern"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button
                size="icon"
                variant="ghost"
                className="text-charcoal hover:text-fern"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setCartOpen(true)}
                className="text-charcoal hover:text-fern"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cart?.totalQuantity > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-fern text-white"
                >
                  {cart.totalQuantity}
                </Badge>
              )}
            </div>
            {isLoggedIn ? (
              <>
                <Link href="/account">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-charcoal hover:text-fern"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-charcoal hover:text-fern"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-charcoal hover:text-fern"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden text-charcoal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-oat bg-cream px-4 py-3">
            <form onSubmit={handleSearch} className="mx-auto max-w-md flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="flex-1 border border-oat rounded-md px-3 py-1.5 text-sm bg-white text-charcoal placeholder:text-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-fern/30 focus:border-fern"
              />
              <Button type="submit" size="sm" className="bg-fern hover:bg-fern-dark text-white">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-oat bg-cream px-4 py-4 flex flex-col gap-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className="text-sm font-medium text-charcoal/80 hover:text-fern transition-colors"
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <CartSlideout open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
