"use client";

import { useState } from "react";
import { Plus, GripVertical, X } from "lucide-react";

export default function DynamicOptions() {
  // Start the form with two default empty options
  const [options, setOptions] = useState(["Option 1", "Option 2"]);

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (indexToRemove: number) => {
    // Prevent them from deleting everything (minimum 2 options)
    if (options.length <= 2) return;
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3 p-6 border rounded-xl bg-white shadow-sm mt-4">
      <h3 className="font-bold text-gray-800 mb-4">Voting Options</h3>
      
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-3">
          <GripVertical className="text-gray-300 cursor-grab" size={20} />
          
          {/* Note the name="options" - this is the magic trick! */}
          <input
            type="text"
            name="options" 
            placeholder={option}
            required
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/5"
          />
          
          <button 
            type="button" 
            onClick={() => removeOption(index)}
            className={`p-2 text-gray-400 hover:text-red-500 transition-colors ${options.length <= 2 ? 'invisible' : ''}`}
          >
            <X size={20} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="flex items-center text-sm font-bold text-gray-600 hover:text-black transition-colors mt-4 px-2"
      >
        <Plus size={16} className="mr-1" />
        Add a new option
      </button>
    </div>
  );
}