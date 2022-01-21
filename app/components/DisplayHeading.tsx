import RoundContainer from './RoundContainer';

interface Props {
  title: string;
  titleColor?: string;
  span?: string;
  spanColor?: string;
  description?: string;
}

export default function Display({
  title,
  span,
  titleColor,
  spanColor,
  description,
}: Props) {
  // main fun?ction
  return (
    <RoundContainer className="pl-5 mt-5">
      <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12 animate-bounce animate-infinite"></span>
      <h1
        className={`font-display uppercase text-5xl sm:text-7xl font-black flex flex-col leading-none dark:text-${titleColor} text-gray-800`}
      >
        {title}{' '}
        <span className={`text-3xl text-${spanColor} sm:text-5xl`}>{span}</span>
      </h1>
      <p className="font-body text-md sm:text-base text-lg text-gray-500	">
        {description}
      </p>
    </RoundContainer>
  );
}
