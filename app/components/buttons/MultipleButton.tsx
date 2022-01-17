import React from 'react';
import { Link } from 'remix';
interface Props {
  labels: Array<{to:string, label:string}>;
}
const MultipleButton = (labels: Array<{ to: string; label: string }>) => {
  return (
    <div className="flex items-center">
      {
        labels.map((label) => (
          <Link to={label.to}>
            <button
              type="button"
              className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              {label.label}
            </button>
          </Link>
        ))}
    </div>
  );
};
export default MultipleButton;
