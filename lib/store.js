import {configureStore} from "@reduxjs/toolkit";
import pageNoReducer from "./slices/pageNo";
import videoReducer from "./slices/videos";

export const store = configureStore({
    reducer : {
        pageNo : pageNoReducer,
        videos : videoReducer
    }
});