import { Link } from 'remix';

interface Button {
  items: Props[];
}
interface Props {
  label: string;
  to: string;
}
const MultipleButton = (props: Button) => {
  return (
    <div className="flex items-center">
      {props.items &&
        props.items.map((button) => (
          <Link to={button.to}>
            <button
              type="button"
              className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              {button.label}
            </button>
          </Link>
        ))}
    </div>
  );
};
export default MultipleButton;
