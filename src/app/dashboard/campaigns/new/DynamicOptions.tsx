"use client";

import { useState } from "react";

export default function DynamicOptions() {
  const [options, setOptions] = useState(["Option 1", "Option 2"]);

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-4 border p-6 rounded-xl bg-white">
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* The little radio circle for aesthetics */}
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            
            <input
              type="text"
              name="options" // Keeping this the same means formData.getAll("options") works perfectly!
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-black"
              placeholder={`Option ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={addOption}
        className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1"
      >
        + Add a new option
      </button>
    </div>
  );
}
