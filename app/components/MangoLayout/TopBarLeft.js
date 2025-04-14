
export default function TopBarLeft() {
  return (
    <div className="flex gap-2.5 md:gap-3.5 lg:gap-5 items-center col-span-3 h-full">
            <div className="w-4 md:w-7">
              <img src="/list.svg" alt="" className="object-cover" />
            </div>
            <button className="w-4 md:w-6 lg:w-8">
              <img
                src="/youtubelogo.svg"
                alt="youtube"
                className=""
              />
            </button>
            <p className="text-[7.5px] text-xs md:text-[1rem] font-bold -ml-2.5 md:-ml-3.5 lg:-ml-5">MangoTube</p>
    </div>
  )
}
