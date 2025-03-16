import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: 'feed',
    initialState: null,
    reducers:{
        addFeed: (state,action) =>{
            return action.payload;
        },
        removefeed: (state,action) =>{
            state.data = state.data.filter((u)=>u._id !== action.payload) //u = user
        }
    }
});

export const {addFeed,removefeed} = feedSlice.actions;
export default feedSlice.reducer;