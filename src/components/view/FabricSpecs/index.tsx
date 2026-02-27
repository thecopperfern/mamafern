"use client";

import { useState } from "react";
import { ChevronDown, Leaf, Shirt, Droplets, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type FabricSpec = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type Props = {
  specs?: {
    material?: string;
    weight?: string;
    feel?: string;
    fit?: string;
    care?: string;
    certifications?: string;
  };
};

const iconMap: Record<string, React.ReactNode> = {
  material: <Leaf className="h-4 w-4" />,
  weight: <Shirt className="h-4 w-4" />,
  feel: <Heart className="h-4 w-4" />,
  fit: <Shirt className="h-4 w-4" />,
  care: <Droplets className="h-4 w-4" />,
  certifications: <Shield className="h-4 w-4" />,
};

export default function FabricSpecs({ specs }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert specs object to array of labeled items
  const specItems: FabricSpec[] = specs
    ? Object.entries(specs)
        .filter(([, value]) => value)
        .map(([key, value]) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          icon: iconMap[key],
        }))
    : [];

  // Default specs if none provided (from metafields)
  const defaultSpecs: FabricSpec[] = [
    {
      label: "Material",
      value: "100% Organic Cotton",
      icon: iconMap.material,
    },
    {
      label: "Weight",
      value: "Mid-weight (5.3 oz)",
      icon: iconMap.weight,
    },
    {
      label: "Feel",
      value: "Soft, breathable, and pre-shrunk",
      icon: iconMap.feel,
    },
    {
      label: "Fit",
      value: "True to size with relaxed comfort",
      icon: iconMap.fit,
    },
    {
      label: "Care",
      value: "Machine wash cold, tumble dry low",
      icon: iconMap.care,
    },
    {
      label: "Certifications",
      value: "GOTS Certified Organic",
      icon: iconMap.certifications,
    },
  ];

  const displaySpecs = specItems.length > 0 ? specItems : defaultSpecs;

  return (
    <div className="border border-oat rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-oat/20 transition-colors"
      >
        <span className="text-sm font-medium text-charcoal flex items-center gap-2">
          <Leaf className="h-4 w-4 text-fern" />
          Fabric & Feel
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-warm-brown transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-white border-t border-oat space-y-3">
          {displaySpecs.map((spec, index) => (
            <div key={index} className="flex gap-3">
              {spec.icon && (
                <div className="flex-shrink-0 mt-0.5 text-fern">
                  {spec.icon}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-charcoal">
                  {spec.label}
                </p>
                <p className="text-xs text-warm-brown">{spec.value}</p>
              </div>
            </div>
          ))}

          <div className="pt-2 mt-3 border-t border-oat">
            <p className="text-xs text-warm-brown">
              Made with care for sensitive skin and the planet
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
