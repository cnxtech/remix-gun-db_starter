
interface Props {
title: string;
titleColor?: string;
span?: string;
description?: string;
}

export default function Display({title,span,titleColor, description}: Props){
// main fun?ction
  return (
    <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative z-20">
      <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12"></span>
      <h1 className="font-display uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none dark:text-white text-gray-800">
       {title} <span className="text-5xl sm:text-7xl">{span}</span>
      </h1>
      <p className="font-body text-sm sm:text-base text-gray-700 dark:text-white">
       {description}
      </p>
    </div>
  );
}