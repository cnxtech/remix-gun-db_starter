export default function H1({ title, span }) {
  // main function
  return (
    <div className="bg-white dark:bg-gray-800 ">
      <div className="lg:flex lg:items-center lg:justify-between w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
        <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
          <span className="block">{title}</span>
          <span className="block text-indigo-500">{span}</span>
        </h2>
        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className=" inline-flex rounded-md shadow">
            {/* <button
              type="button"
              className="py-4 px-6  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              {button}
            </button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <button
              type="button"
              className="py-4 px-6  bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              {button2}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
