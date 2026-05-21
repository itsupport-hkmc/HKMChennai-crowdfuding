import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BE_API_URL } from "../../constants/homePage";

const api = BE_API_URL;
// const api = "http://172.236.187.67"
const be_api = api; //"https://nodebe.ages.fun"

const token = 'iskonhublicampaign'

export const fetchUser = createAsyncThunk("getUserList",async(_,{rejectWithValue})=>{
      try {
        
        const response = await fetch(`${api}/showcampaigns`);
        const data = await response.json();
          console.log(JSON.stringify(data));
         if(!response.ok){
            throw new Error("Network call is not ok")
         }

         return data

      } catch (error) {
        return rejectWithValue(error.message)
      }
});

export const fetchSingleUser = createAsyncThunk("getSingleUser",async(id,{rejectWithValue})=>{
     try {
          
          const response = await fetch(`${api}/campaign/${id}`,{
                method:'GET'
          });
          const data = await response.json();

          if(!response.ok){
               throw new Error("Network call is not ok")
            }

            return data

     } catch (error) {
          return rejectWithValue(error.message)
     }
})

export const postPaymentFormData = createAsyncThunk("paymentFormData",async(formData,{rejectWithValue})=>{


      try {
          
          const response = await fetch(`${be_api}/create-payment`,{
               method:'POST',
            body:JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Add token to the Authorization header
              },
          })

          if(!response.ok){
               throw new Error("Network call is not ok")
            }
   
            const data = await response.json();

            return data

      } catch (error) {
          return rejectWithValue(error.message)
      }
})

export const postPaymentSuccess = createAsyncThunk("paymentsuccess",async(id,{rejectWithValue})=>{
     try {
          
          const response = await fetch(`${api}/checkpayment`,{
               method:"POST",
               body:JSON.stringify(id),
               headers:{
                   'Content-Type': 'application/json',  
               }
          })

          const data = await response.json();

          return data

     } catch (error) {
          return rejectWithValue(error.message)
     }
})

const initialState = {
     isLoading:false,
     isError:null,
     getUsers:[],
     getSingleUser : {}
}

const getUsersSlice = createSlice({
      name:"getUsers",
      initialState,
      reducers:{},
      extraReducers:(builder)=>{
        builder
        .addCase(fetchUser.pending,(state)=>{
             state.isLoading = true;
             state.isError = null
        })
        .addCase(fetchUser.fulfilled,(state,{payload})=>{
             state.isLoading = false;
             state.isError = null;
             state.getUsers = payload
        })
        .addCase(fetchUser.rejected,(state,{payload})=>{
             state.isLoading = false;
             state.isError = payload;
             state.getUsers  =[]
        })

     //    Handle Single Users
        .addCase(fetchSingleUser.pending,(state)=>{
            state.isLoading = true;
            state.isError = null
        })
        .addCase(fetchSingleUser.fulfilled,(state,{payload})=>{
           state.isLoading = false;
           state.isError = null;
           state.getSingleUser = payload
        })
        .addCase(fetchSingleUser.rejected,(state,{payload})=>{
            state.isLoading = false;
            state.isError = payload;
            state.getSingleUser = {}
        })
        .addCase(postPaymentFormData.pending,(state)=>{
          state.isLoading = true;
          state.isError = null
        })
        .addCase(postPaymentFormData.fulfilled,(state,{payload})=>{
           state.isLoading = false;
           state.isError = null;
        })
        .addCase(postPaymentFormData.rejected,(state,{payload})=>{
           state.isLoading = false;
           state.isError = payload
        })

      // Success Payment
      .addCase(postPaymentSuccess.pending,(state)=>{
           state.isLoading = true;
           state.isError = null;
      })
      .addCase(postPaymentSuccess.fulfilled,(state)=>{
          state.isLoading = false;
          state.isError = null
      })
      .addCase(postPaymentSuccess.rejected,(state,{rejectWithValue})=>{
          state.isLoading = false;
          state.isError = rejectWithValue
      })

      }

});

export default getUsersSlice.reducer
