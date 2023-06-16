import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    id: string;
    firstName: string;
    lastName: string;
    account: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    avatar: string;
}

const initialState: UserState = {
    id: '',
    firstName: '',
    lastName: '',
    account: '',
    email: '',
    accessToken: '',
    refreshToken: '',
    avatar: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            const { id, firstName, lastName, email, account, accessToken, refreshToken, avatar } = action.payload;
            state.id = id;
            state.firstName = firstName;
            state.lastName = lastName;
            state.email = email;
            state.account = account;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.avatar = avatar;
        },
        clearUser: (state) => {
            state.id = '';
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.account = '';
            state.accessToken = '';
            state.refreshToken = '';
            state.avatar = '';
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer