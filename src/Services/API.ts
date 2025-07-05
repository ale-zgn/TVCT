import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as SecureStore from 'expo-secure-store'
import Config from '../Config'
import { Car, Center, User, UserCreateForm } from './Interface'

export interface ResponseType {
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
        createUser: builder.mutation<User, UserCreateForm>({
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
        getUser: builder.query<User, any>({
            query: () => ({
                url: `/users/me`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data.user,
        }),
        getAddressPredictions: builder.query<any, string>({
            query: (keyword) => ({
                url: `/users/me/address/predictions?keyword=${keyword}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        createCar: builder.mutation<any, any>({
            query: (data) => ({
                url: '/users/me/cars',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getCars: builder.query<Car[], any>({
            query: () => ({
                url: '/users/me/cars',
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getCar: builder.query<Car, number>({
            query: (id) => ({
                url: `/users/me/cars/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        createCenter: builder.mutation<any, any>({
            query: (data) => ({
                url: '/centers',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getCenters: builder.query<Center[], void>({
            query: (id) => ({
                url: `/centers`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getCenterAvailibility: builder.query<any, void>({
            query: (id) => ({
                url: `/centers/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
    }),
})

export const {
    useAuthMutation,
    useGetAddressPredictionsQuery,
    useLazyGetAddressPredictionsQuery,
    useCreateUserMutation,
    useGetUserQuery,
    useCreateCarMutation,
    useGetCarsQuery,
    useGetCarQuery,
    useLazyGetCarQuery,
    useCreateCenterMutation,
    useGetCentersQuery,
    useLazyGetCenterAvailibilityQuery,
} = API
