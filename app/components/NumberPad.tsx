export default function NumPad() {
  // main function
  return (
    <div
      className="w-full mx-auto rounded-xl bg-gray-900 shadow-xl text-gray-800 relative overflow-hidden"
      style={{ maxWidth: '600px' }}
    >
      <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-gray-700 flex items-end text-right">
        <div className="w-full py-5 px-6 text-6xl text-white font-thin"></div>
      </div>
      <div className="w-full bg-gradient-to-b from-indigo-400 to-indigo-500">
        <div className="flex w-full">
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              4
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              5
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              6
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">
              -
            </button>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              1
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              2
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              3
            </button>
          </div>
          <div className="w-1/4 border-r border-b border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">
              +
            </button>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/4 border-r border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              0
            </button>
          </div>
          <div className="w-1/4 border-r border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">
              .
            </button>
          </div>
          <div className="w-2/4 border-r border-indigo-400">
            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-30 hover:bg-opacity-40 text-white text-xl font-light">
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
