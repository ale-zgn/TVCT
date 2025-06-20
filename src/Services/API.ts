import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as SecureStore from 'expo-secure-store'
import Config from '../Config'
interface UserCreateForm {
    phone: string
    email: string
    password: string
    full_name: string
    address: string
}
interface ResponseType {
    data: any
    status: string
}

export const API = createApi({
    reducerPath: 'API',
    tagTypes: ['UserMe'],
    baseQuery: fetchBaseQuery({
        baseUrl: Config.EXPO_PUBLIC_API_ROOT,
        prepareHeaders: async (headers) => {
            const token = await SecureStore.getItemAsync('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),

    endpoints: (builder) => ({
        auth: builder.mutation<any, any>({
            query: ({ email, password }) => ({
                url: '/auth',
                method: 'POST',
                body: {
                    email: email,
                    password: password,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        createUser: builder.mutation<any, UserCreateForm>({
            query: ({ phone, email, full_name, address, password }) => ({
                url: '/users',
                method: 'POST',
                body: {
                    phone,
                    email,
                    password,
                    full_name,
                    address,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getAddressPredictions: builder.query<any, string>({
            query: (keyword) => ({
                url: `/users/me/address/predictions?keyword=${keyword}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
    }),
})

export const { useAuthMutation, useGetAddressPredictionsQuery, useLazyGetAddressPredictionsQuery, useCreateUserMutation } = API
