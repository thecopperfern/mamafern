"use client";

import type { CommerceProductOption } from "@/lib/commerce";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

type ProductOptionsProps = {
  options: CommerceProductOption[];
  selectedOptions?: Record<string, string>;
  setSelectedOptions?: (options: Record<string, string>) => void;
};

const ProductOptions = ({
  options,
  selectedOptions = {},
  setSelectedOptions,
}: ProductOptionsProps) => {
  const handleOptionChange = (optionName: string, value: string) => {
    const updatedOptions = {
      ...selectedOptions,
      [optionName]: value,
    };
    setSelectedOptions?.(updatedOptions);
  };

  const renderOptionUI = (option: CommerceProductOption) => {
    switch (option.name.toLowerCase()) {
      case "color":
        return (
          <div className="flex items-center gap-2">
            {option.optionValues.map((value) => (
              <Button
                key={value.id}
                className={cn(
                  "p-0 transition-all duration-300 ease-in-out hover:scale-[1.05]",
                  {
                    "ring-2 ring-fern":
                      selectedOptions[option.name] === value.name,
                  }
                )}
                onClick={() => handleOptionChange(option.name, value.name)}
                style={{
                  backgroundColor: value.swatch?.color ?? value.name,
                  width: "24px",
                  height: "24px",
                  borderRadius: "100%",
                }}
              />
            ))}
          </div>
        );

      case "size":
        return (
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((value) => (
              <Button
                key={value.id}
                size="sm"
                variant={
                  selectedOptions[option.name] === value.name
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "transition-all duration-300 ease-in-out hover:scale-[1.05]",
                  selectedOptions[option.name] === value.name &&
                    "bg-fern hover:bg-fern-dark"
                )}
                onClick={() => handleOptionChange(option.name, value.name)}
              >
                {value.name}
              </Button>
            ))}
          </div>
        );

      default:
        return (
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((value) => (
              <Button
                key={value.id}
                variant={
                  selectedOptions[option.name] === value.name
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  selectedOptions[option.name] === value.name &&
                    "bg-fern hover:bg-fern-dark"
                )}
                onClick={() => handleOptionChange(option.name, value.name)}
              >
                {value.name}
              </Button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex w-full gap-4">
      {options.map((option) => (
        <div key={option.name} className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-charcoal">
            {option.name}
          </label>
          {renderOptionUI(option)}
        </div>
      ))}
    </div>
  );
};

export default ProductOptions;
