import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    page : 1,
}

export const pageNoSlice = createSlice({
    name : "pageNo",
    initialState,
    reducers : {
        incrementPageNo : (state,action) => {
            state.page = state.page + 1;
        },
    },
})

export const {incrementPageNo} = pageNoSlice.actions;
export default pageNoSlice.reducer;