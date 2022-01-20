import RoundContainer from '../RoundContainer';

export default function Columns(children: any, columns: string) {
  // main function
  return (
    <>
      <RoundContainer>
        <div className={`mt-10 pt-16 grid grid-cols-2 gap-8`}>
          {children}
        </div>
      </RoundContainer>
    </>
  );
}
