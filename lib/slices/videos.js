import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    videos : [],
}

export const videoSlice = createSlice({
    name : "videos",
    initialState,
    reducers : {
        setVideos : (state,action) => {
            state.videos = action.payload;
        },
        addVideos : (state,action) => {
            state.videos = [...state.videos,...action.payload];
        },
        clearVideos : (state) => {
            state.videos = [];
        },
    }
});

export const {setVideos,addVideos,clearVideos} = videoSlice.actions;
export default videoSlice.reducer;