import { UserType } from "@/app/_interfacess/Post.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import cookie from "js-cookie";


// token بحدد نوع الـ
type InitialStateType = {
    token: string | null;
    userData: UserType | null;
}

// token دي القيمه الابتدائية للـ
const initialState: InitialStateType = {
    token: null,
    userData: null,
}

// Get logged User Data
export const getUserData = createAsyncThunk("auth/getUserData", async function(){
    const {data} = await axios.get(`${process.env.baseUrl}/users/profile-data`,{
        headers:{
            token:cookie.get("userTokenSocialApp")!,
        }
    });
        return data.user;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // عشان أقدر أستخدمه ف أى مكان token بخزن فيها الـ Login عملتها عشان أهندل
        setUserToken: function(state , action){
            state.token = action.payload; // payload بتيجى ف ال token ال
        },

        // null ب token بتخلي الـ LogOut عملتها عشان أهندل
        clearUserData: function(state){
            state.token = null;
            cookie.remove("userTokenSocialApp");
        },
    },

    extraReducers:function(builder) {
        builder.addCase(getUserData.fulfilled,function(state,action){
            // console.log(action);
            state.userData = action.payload;
            
        })
    },

});

export default authSlice.reducer;
export const {clearUserData , setUserToken} = authSlice.actions;
