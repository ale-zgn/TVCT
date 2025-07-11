import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as SecureStore from 'expo-secure-store'
import Config from '../Config'
import { Car, Center, Payment, Reservation, User, UserCreateForm, UserNotification } from './Interface'

export interface ResponseType {
    data: any
    status: string
}

export const API = createApi({
    reducerPath: 'API',
    tagTypes: ['UserMe', 'Reservation', 'Center', 'Car', 'Notification'],
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
            invalidatesTags: ['Car'],
        }),
        getCars: builder.query<Car[], any>({
            query: () => ({
                url: '/users/me/cars',
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Car'],
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
            invalidatesTags: ['Center'],
        }),
        getCenters: builder.query<Center[], void>({
            query: (id) => ({
                url: `/centers`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Center'],
        }),
        deleteCenter: builder.mutation<any, number>({
            query: (id) => ({
                url: `/centers/${id}`,
                method: 'PUT',
                body: {},
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Center'],
        }),

        getCenterAvailibility: builder.query<any, { id: number; date: string }>({
            query: ({ id, date }) => ({
                url: `/centers/${id}?date=${date}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Center'],
        }),
        createReservation: builder.mutation<any, any>({
            query: (data) => ({
                url: '/reservations',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation', 'Center', 'Car'],
        }),

        updateReservation: builder.mutation<Reservation, { id: number; car_id: number; date: string }>({
            query: ({ car_id, id, date }) => ({
                url: `/users/me/cars/${car_id}/reservations/${id}`,
                method: 'PUT',
                body: {
                    date: date,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation'],
        }),
        updateReservationStatus: builder.mutation<Reservation, { id: number; status: number }>({
            query: ({ id, status }) => ({
                url: `/reservations/${id}/status`,
                method: 'PUT',
                body: {
                    status: status,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation'],
        }),

        updateReservationPaymentStatus: builder.mutation<Reservation, { id: number; code: string }>({
            query: ({ id, code }) => ({
                url: `/users/me/reservations/${id}/code`,
                method: 'PUT',
                body: {
                    code: code,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation'],
        }),
        getReservations: builder.query<Reservation[], void>({
            query: () => ({
                url: `/users/me/reservations`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Reservation'],
        }),
        getReservation: builder.query<Reservation, number>({
            query: (id) => ({
                url: `/users/me/reservations/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Reservation'],
        }),
        getAllReservations: builder.query<Reservation[], void>({
            query: () => ({
                url: `/reservations`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Reservation'],
        }),
        getNotifications: builder.query<UserNotification[], void>({
            query: () => ({
                url: `/users/me/notifications`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Notification'],
        }),

        getPaymentIntent: builder.mutation<{ clientSecret: any }, any>({
            query: (amount) => ({
                url: `/create-payment-intent`,
                method: 'POST',
                body: { amount: amount },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation', 'Center', 'Car'],
        }),

        createPayment: builder.mutation<any, any>({
            query: (data) => ({
                url: `/users/me/reservations/${data.id}/payment`,
                method: 'POST',
                body: { amount: data.amount, method: data.method, card: data.card, user_id: data.user_id },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ['Reservation', 'Center', 'Car'],
        }),

        getPayments: builder.query<Payment[], void>({
            query: () => ({
                url: `/users/me/payments`,
                method: 'GET',
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ['Notification'],
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
    useCreateReservationMutation,
    useDeleteCenterMutation,
    useUpdateReservationStatusMutation,
    useGetReservationsQuery,
    useGetAllReservationsQuery,
    useGetNotificationsQuery,
    useUpdateReservationMutation,
    useUpdateReservationPaymentStatusMutation,
    useLazyGetReservationQuery,
    useGetPaymentIntentMutation,
    useCreatePaymentMutation,
    useGetPaymentsQuery,
} = API
