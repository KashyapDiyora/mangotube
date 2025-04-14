import Link from "next/link";
import { useSession } from "next-auth/react";
import { History } from "lucide-react";
export function LeftBar(){
  const { data: session } = useSession();

  return (
    <>
      <div className="w-10 md:w-20 h-full">
        <div className="flex flex-col items-center justify-start gap-y-10 md:gap-y-11 lg:gap-y-12 w-full h-full pt-4">
          <Link href={"/"} className={`w-fit flex flex-col items-center`}>
            <img
              src="/home.svg"
              alt=""
              className="object-cover w-2 md:w-6"
            />
            <p className="text-[8px] md:text-xs ">Home</p>
          </Link>

          <Link href={"/subscription"} className={`w-fit flex flex-col items-center`}>
            <img
              src="/subscription.png"
              alt=""
              className="object-cover w-2 md:w-6"
            />
            <p className="text-[7px] md:text-xs ">Subscription</p>
          </Link>

          <Link href={`/channel/${session?.user?.name?.replace(" ","_")}`} className={`w-fit flex flex-col items-center `}>
            <img
              src="/user.png"
              alt=""
              className="object-cover w-2 md:w-6"
            />
            <p className="text-[8px] md:text-xs ">You</p>
          </Link>
          
          <Link href={"/history"} className={`w-fit flex flex-col items-center`}>
            <History className="w-2 md:w-6 " />
            <p className="text-[8px] md:text-xs ">History</p>
          </Link>

        </div>
      </div>
    </>
  );
}
