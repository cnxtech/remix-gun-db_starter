import React from 'react';

interface Props {
  type: 'alert' | 'success' | 'danger';
  title: string;
  text: string;
  key: string;
  ref: any;
  visible: boolean;
}

const SimpleAlert = ({ type, title, text, key, ref, visible }: Props) => {
  let cssClasses = 'bg-yellow-200 border-yellow-600 text-yellow-600';
  if (type !== 'alert') {
    cssClasses =
      type === 'success'
        ? 'bg-green-200 border-green-600 text-green-600'
        : 'bg-red-200 border-red-600 text-red-600';
  }

  return (
    <div
      className={`${cssClasses} border-l-4 p-4 fixed t-8  l-8 ${
        !visible ? 'hidden' : 'visible'
      }`}
      key={key}
      ref={ref}
      role="alert"
    >
      <p className="font-bold">{title}</p>
      <p>{text}</p>
    </div>
  );
};

export default SimpleAlert;
