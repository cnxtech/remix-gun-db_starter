
type Avi = {
size: number |string;
class?: string;
}

export default function AviSkeleton(props: Avi) {
// main function
  return (
    <>
     { <div className="w-12 bg-gray-300 h-12 rounded-full "></div>}
    </>
  );
}