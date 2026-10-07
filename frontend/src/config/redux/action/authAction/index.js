import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });
            if(response.data.token)
                localStorage.setItem("token", response.data.token)
            else{
                return thunkAPI.rejectWithValue({
                    message: "Token not provided"
                });
            }
            return thunkAPI.fulfillWithValue(response.data.token)
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data ?? {message: "Unable to log in right now."});
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,
            });
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data ?? {message: "Unable to register right now."});
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data ?? {message: "Unable to load your profile."});
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/get_all_users", {
                params: {token: typeof window !== "undefined" ? localStorage.getItem("token") : null}
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data ?? {message: "Unable to load profiles."});
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token: user.token,
                connectionId: user.user_id
            });
            thunkAPI.dispatch(getConnectionsRequest({token:user.token}));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data?.message ?? "Unable to send connection request.");
        }
    }
)

export const getConnectionsRequest = createAsyncThunk(
    "user/getConnectionRequests",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/getConnectionRequests", {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data?.message ?? "Unable to load your network.");
        }
    }
)

export const getMyConnectionRequests = createAsyncThunk(
    "/user/getMyConnectionRequests",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/user_connection_request", {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data?.message ?? "Unable to load connection requests.");
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "/user/AcceptConnection",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            });
            thunkAPI.dispatch(getMyConnectionRequests({token:user.token}));//there is an issue here
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error){
            return thunkAPI.rejectWithValue(error.response?.data?.message ?? "Unable to update connection request.");
        }
    }
)