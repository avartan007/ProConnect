import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests, loginUser, registerUser, sendConnectionRequest } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn:false,
    isTokenThere: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.message = {
                message:"Knocking the door..."
            }
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = {
                message:"Login is successful"
            }
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.message = {
                message:"Registering you..."
            }
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = {
                message:"Registration is successful. Please login."
            }
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;
        })
        .addCase(getAboutUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.profileFetched = false;
            state.message = action.payload ?? {message: "Unable to load your profile."};
        })
        .addCase(getAllUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched=true;
            state.all_users = action.payload.profiles;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload ?? {message: "Unable to load profiles."};
        })
        .addCase(getConnectionsRequest.fulfilled, (state,action) => {
            state.connections = action.payload;
        })
        .addCase(getConnectionsRequest.rejected, (state,action) => {
            state.message = action.payload;
        })
        .addCase(getMyConnectionRequests.fulfilled, (state,action) => {
            state.connectionRequest = action.payload;
        })
        .addCase(getMyConnectionRequests.rejected, (state,action) => {
            state.message = action.payload;
        })
    }
})

export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;