
import { configureStore } from "@reduxjs/toolkit";
import authSlice  from "./authSlice";

export const store = configureStore({
    reducer: {
        authSlice,
    }
});

/*
    بتاعنا store كله اللي جواه كل البيانات اللي في الـ  state بنعمله عشان نعرف شكل الـ 
    ( وكل الداتا اللي فيه slices يعني كل ال ) Redux store اللي جواه الـ state  بتجيبلك كل ال function دي <= store.getState
    مش قيمتها function بيجيب نوع ال <= typeof store.getState
    بتاعها return وتطلعلك نوع ال function بتاخد TypeScript من Utility Type دي <= ReturnType
*/
export type StoreType = ReturnType<typeof store.getState>;