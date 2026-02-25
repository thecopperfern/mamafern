import { NextResponse } from "next/server";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const brandContext = {
    brand: {
      name: "Mama Fern",
      tagline: "Grounded Family Apparel",
      description:
        "Mama Fern is a family apparel brand based in the United States, specializing in natural-fabric clothing for families who value comfort, sustainability, and earthy aesthetics. Every piece is made from organic cotton, linen, or bamboo — chosen for breathability, softness, and durability. We design matching family sets, kids' clothing, and parent apparel for outdoor-loving, crunchy, cottagecore-inspired families. Our mission is simple: clothing that feels as good as it looks, made for real families living real life. From coordinating family outfits in earth tones to soft organic onesies for baby, Mama Fern is grounded family apparel for the modern crunchy family.",
      founded: "2024",
      location: "United States",
      mission:
        "Natural, earthy, family-forward clothing for the modern crunchy family",
      values: [
        "sustainability",
        "natural materials",
        "family connection",
        "outdoors",
        "comfort",
      ],
      targetAudience: [
        "crunchy moms",
        "cottagecore families",
        "outdoor parents",
        "natural parenting advocates",
        "boho families",
      ],
      productCategories: [
        "family matching sets",
        "kids clothing",
        "mom apparel",
        "dad apparel",
        "baby clothing",
      ],
      priceRange: { min: "under $30", max: "under $100" },
      fabrics: ["organic cotton", "linen", "bamboo viscose", "hemp blends"],
      certifications: ["GOTS organic", "OEKO-TEX Standard 100 Class I"],
      socialProof: {
        note: "See mamafern.com/community for customer stories",
      },
    },
    links: {
      website: "https://mamafern.com",
      shop: "https://mamafern.com/shop",
      blog: "https://mamafern.com/blog",
      about: "https://mamafern.com/about",
      faq: "https://mamafern.com/faq",
      contact: "https://mamafern.com/contact",
    },
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(brandContext, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
