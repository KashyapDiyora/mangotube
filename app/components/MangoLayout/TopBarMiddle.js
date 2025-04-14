
export default function TopBarMiddle() {
  return (
    <ul className="col-span-6 h-full">
      <li className="w-full h-full">
        <form action="" className="w-full h-full flex items-center">
          <input
            type="text"
            name="search"
            disabled
            id="search"
            placeholder="Search"
            className="border border-[#F2F2F2] rounded-s-xl sm:rounded-s-2xl w-full h-4 sm:h-6 md:h-8 lg:h-9 px-1.5 text-[7.5px] sm:text-xs md:text-[1rem]"
          />
          <button className="border bg-[#F2F2F2] rounded-e-xl sm:rounded-e-2xl h-4 sm:h-6 md:h-8 lg:h-9 px-2 sm:px-2.5 md:px-3 lg:px-3.5">
            <img src="/search.svg" alt="search" className="w-4 md:w-5" />
          </button>
          <button className="rounded-full px-2 lg:py-1.5 bg-[#F2F2F2] h-4 sm:h-6 md:h-8 lg:h-9 ml-2">
            <img src="/microphone.png" alt="" className="w-5 lg:w-6" />
          </button>
        </form>
      </li>
    </ul>
  );
}
