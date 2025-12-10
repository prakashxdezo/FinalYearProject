import Radio from "@mui/material/Radio";
import React from "react";

const Addresscard = ({ value, selectedValue, handleChange, item }) => {
  return (
    <div className="p-5 border border-gray-300 rounded-md flex">
      <div>
        <Radio
          checked={selectedValue == value}
          value={value}
          onChange={handleChange}
          name="radio-buttons"
        />
      </div>

      <div className="space-y-3 pt-3">
        <h1> {"Ram poudel"} </h1>
        <p>{"street 123, ktm, 345678, nayabazzar, nepal"}</p>
        <p>
          <strong>Mobile:</strong> 9807654321
        </p>
      </div>
    </div>
  );
};

export default Addresscard;
