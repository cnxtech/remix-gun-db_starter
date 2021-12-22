import React, { FC } from 'react';
interface Props {
    labels: Array<string>;
}
const MultipleButton: FC = ({props}:Props) => {
    return (
        <div className="flex items-center">
            {props.labels &&
                props.labels.map((label: string) => (
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
