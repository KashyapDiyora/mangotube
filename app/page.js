"use client";
import TopBar from "./components/TopBar";
import VideoCard from "./components/VideoCard";
import { LeftBar } from "./components/LeftBar";
import {Provider} from "react-redux";
import {store} from "@/lib/store";
export default function Home() {
  return (
    <div className="w-full h-full">
      <TopBar />
      <div className="flex flex-row w-full h-full">
        <LeftBar />
        <Provider store={store}>
          <VideoCard />
        </Provider>
      </div>
    </div>
  );
}
