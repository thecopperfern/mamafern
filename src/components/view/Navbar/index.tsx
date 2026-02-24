"use client";

import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogOut, Search, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartActions, isCartOpenAtom } from "@/lib/atoms/cart";
import { useAtom } from "jotai";
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
  const [cartOpen, setCartOpen] = useAtom(isCartOpenAtom);
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
      <header className="sticky top-0 z-50 bg-texture-linen-wash border-b border-oat/60" role="banner">
        <div className="mx-auto max-w-6xl px-4 py-4">
          {/* Logo centered */}
          <div className="flex justify-center mb-3">
            <Logo />
          </div>

          {/* Navigation and actions */}
          <div className="flex items-center justify-between">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-x-6" aria-label="Main navigation">
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

            {/* Mobile menu button - left side on mobile */}
            <Button
              className="md:hidden text-charcoal hover:text-fern"
              size="icon"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>

            <div className="flex items-center gap-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-charcoal hover:text-fern"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Link href="/wishlist" aria-label="Wishlist">
              <Button
                size="icon"
                variant="ghost"
                className="text-charcoal hover:text-fern"
                aria-label="View wishlist"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setCartOpen(true)}
                className="text-charcoal hover:text-fern"
                aria-label={`Shopping cart${cart?.totalQuantity > 0 ? `, ${cart.totalQuantity} items` : ''}`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              </Button>
              {cart?.totalQuantity > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-fern text-white"
                  aria-hidden="true"
                >
                  {cart.totalQuantity}
                </Badge>
              )}
            </div>
            {isLoggedIn ? (
              <>
                <Link href="/account" aria-label="My account">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-charcoal hover:text-fern"
                    aria-label="My account"
                  >
                    <User className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-charcoal hover:text-fern"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </Button>
              </>
            ) : (
              <Link href="/auth" aria-label="Log in or sign up">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-charcoal hover:text-fern"
                  aria-label="Log in or sign up"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            )}
          </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-oat/60 bg-texture-linen-wash px-4 py-3" role="search" aria-label="Product search">
            <form onSubmit={handleSearch} className="mx-auto max-w-md flex gap-2">
              <label htmlFor="nav-search" className="sr-only">Search products</label>
              <input
                id="nav-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                aria-label="Search products"
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
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-oat/60 bg-texture-linen-wash px-4 py-4 flex flex-col gap-y-3"
            aria-label="Mobile navigation"
          >
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
