import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React from "react";
import { price } from "../../../../data/filters/price";
import { ageGroups } from "../../../../data/filters/ageGroup";
import { useSearchParams } from "react-router";

const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAgeGroup = searchParams.get("ageGroup") || "";
  const selectedPrice = searchParams.get("priceRange") || "";

  const handleAgeGroupChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("ageGroup", e.target.value);
    setSearchParams(params);
  };

  const handlePriceChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("priceRange", e.target.value);
    const selected = price.find((p) => p.name === e.target.value);
    if (selected) {
      if (selected.min !== undefined) params.set("minPrice", selected.min);
      if (selected.max !== undefined) params.set("maxPrice", selected.max);
    }
    setSearchParams(params);
  };

  const handleClearAll = () => setSearchParams({});

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Active filters</span>
        <Button onClick={handleClearAll} size="small" sx={{ fontSize: 11, color: "#e85d04" }}>
          Clear all
        </Button>
      </div>

      <Divider />

      {/* Age Group */}
      <div>
        <FormControl>
          <FormLabel sx={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Age Group
          </FormLabel>
          <RadioGroup value={selectedAgeGroup} onChange={handleAgeGroupChange}>
            {ageGroups.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio size="small" sx={{ color: "#e85d04", "&.Mui-checked": { color: "#e85d04" } }} />}
                label={<span className="text-sm text-gray-700">{item.name}</span>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>

      <Divider />

      {/* Price */}
      <div>
        <FormControl>
          <FormLabel sx={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Price Range
          </FormLabel>
          <RadioGroup value={selectedPrice} onChange={handlePriceChange}>
            {price.map((item) => (
              <FormControlLabel
                key={item.name}
                value={item.name}
                control={<Radio size="small" sx={{ color: "#e85d04", "&.Mui-checked": { color: "#e85d04" } }} />}
                label={<span className="text-sm text-gray-700">{item.name}</span>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterSection;
