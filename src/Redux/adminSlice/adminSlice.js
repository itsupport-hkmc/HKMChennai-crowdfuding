import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { BE_API_URL } from "../../constants/homePage";

const api = BE_API_URL;
const token = "iskonhublicampaign";
//const api_key = "aXNrb25jYW1wYWlnbmFkbWluOmlza29uY2FtcGFpZ25AMQ==";

export const adminCreateCampaign = createAsyncThunk(
  "createCampaign",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${api}/create-campaign`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Network call is not ok");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDonorsList = createAsyncThunk(
  "donorsList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${api}/show`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network call is not ok");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adminEditCampaign = createAsyncThunk(
  "editCampaign",
  async ({ id, formData }, { rejectWithValue }) => {
    console.log({ id, formData });
    try {
      const response = await fetch(`${api}/update-campaign/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network call is not ok");
      }

      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: null,
  donorsList: [],
  adminData: {},
};

const adminReducer = createSlice({
  name: "admin reducer",
  initialState,
  reducers: {
    getAdminData: (state, { payload }) => {
      state.adminData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminCreateCampaign.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(adminCreateCampaign.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(adminCreateCampaign.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(adminEditCampaign.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(adminEditCampaign.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(adminEditCampaign.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
      })
      .addCase(fetchDonorsList.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchDonorsList.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.isLoading = false;
        state.isError = null;
        state.donorsList = payload;
      })
      .addCase(fetchDonorsList.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
        state.donorsList = [];
      });
  },
});

export const { getAdminData } = adminReducer.actions;
export default adminReducer.reducer;

export async function createCampaigner(id, imageurl) {
  const formData = {
    campaignname: `dummy-${uuidv4()}`,
    targetamount: 5000 + id,
    enddate: "2025-01-29",
    phoneno: "7829454317",
    imgurl: imageurl,
    preachername: `dummy-${uuidv4()}`
  };

  await fetch(`${api}/create-campaign`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add token to the Authorization header
    },
  });
}

export async function updateCampaigner(id, imageurl) {
  const formData = {
    campaignname: `dummy-${uuidv4()}`,
    targetamount: 5000 + id,
    enddate: "2025-01-29",
    phoneno: "7829454317",
    imgurl: imageurl,
    preachername: `dummy-${uuidv4()}`
  };

  await fetch(`${api}/update-campaign/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add token to the Authorization header
    },
  });
}

// (function (params) {

//   for (let index = 10; index < 300; index++) {

//     // createCampaigner(index, `https://picsum.photos/200/300?random=${index}` )
//   }
// }())

// (function (params) {

//   for (let index = 1; index < 500; index++) {

//     updateCampaigner(index, `https://picsum.photos/200/300?random=${index}` )
//   }
// }())
