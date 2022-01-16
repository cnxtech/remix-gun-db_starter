import React from 'react';
import { Link } from 'remix';
interface Props {
  labels: Array<string>;
}
const MultipleButton = ({ labels }: Props) => {
  return (
    <div className="flex items-center">
      {labels &&
        labels.map((label: string) => (
          <Link to={label}>
            <button
              type="button"
              className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              {label}
            </button>
          </Link>
        ))}
    </div>
  );
};
export default MultipleButton;
