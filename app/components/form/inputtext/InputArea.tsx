import React from 'react';

const InputArea = () => {
    return (
      <label className="text-gray-700" htmlFor="name">
        <textarea
          className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-gray-900 text-gray-300 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          id="description"
          placeholder="Enter your description"
          name="description"
          rows={5}
          cols={40}
        />
      </label>
    );
};

export default InputArea;
