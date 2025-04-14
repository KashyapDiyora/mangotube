import TopBarMiddle from "./MangoLayout/TopBarMiddle";
import TopBarRight from "./MangoLayout/TopBarRight";
import TopBarLeft from "./MangoLayout/TopBarLeft";

export const TopBar = (props) => {
  
  return (
    <>
      <div className="w-full h-8 sm:h-12 md:h-14 lg:h-16 ">
        <nav className="grid grid-cols-12 mx-3 sm:mx-4 md:mx-5 lg:mx-6 h-full ">
          <TopBarLeft />
          <TopBarMiddle />
          <TopBarRight />
        </nav>
      </div>
    </>
  );
};

export default TopBar;
