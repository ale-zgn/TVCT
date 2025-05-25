import { PhoneIcon } from "./../../assets/svgs/Svg"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
    ApiNewsInterface,
    ApiPropertiesInterface,
    AuthInterface,
    AuthRequestInterface,
    TicketInterface,
    UpdateUserInterface,
    UserDocumentInterface,
    UserInterface,
    PropertyDataInterface,
    UserNotificationsPreferences,
    InvoiceInterface,
    UserAppointment,
    AvailableAppointments,
    AvailabilitiesPerMonth,
    ApiInterestInterface,
    WarrantyInterface,
    FileInterface,
    CreateTicketInterface,
    InsertInterface,
    SurveyInterface,
    PushTokenRegistration,
    PushTokenUnregistration,
    UserPhoneCodeRequestInterface,
    UserEmailCodeRequestInterface,
    UserEmailUpdateInterface,
    UserPhoneUpdateInterface,
    UserNotification,
} from "../Interfaces/API"
import * as SecureStore from "expo-secure-store"
import Config from "../Config"

import { Acf, WPProperty } from "../Interfaces/APIWP"
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers"

interface ResponseType {
    data: any
    status: string
}

const S3_PATH_USER_PICTURE = "users/pictures"

export const API_WP = createApi({
    reducerPath: "API",
    baseQuery: fetchBaseQuery({
        baseUrl: Config.EXPO_PUBLIC_API_WORDPRESS,
    }),
    endpoints: (builder) => ({
        getArticles: builder.query<ApiNewsInterface[], string>({
            query: (language) => (language === "en" ? "articles?lang=en" : "articles?lang=ar"),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getProperties: builder.query<WPProperty[], any>({
            query: (language) => (language === "en" ? "properties2?lang=en" : "properties2?lang=ar"),
            transformResponse: (response: ResponseType) => response.data,
        }),
        getBanners: builder.query<InsertInterface[], any>({
            query: (language) => (language === "en" ? "banners?lang=en" : "banners?lang=ar"),
            transformResponse: (response: ResponseType) => response.data,
        }),
        registerPropertyInterest: builder.mutation<ApiInterestInterface, any>({
            query: (data) => ({
                url: "leads",
                method: "POST",
                body: data,
            }),
        }),
    }),
})

console.log(Config.EXPO_PUBLIC_API_ROOT)

export const API_RETAL = createApi({
    reducerPath: "API_RETAL",
    tagTypes: ["UserMe"],
    baseQuery: fetchBaseQuery({
        baseUrl: Config.EXPO_PUBLIC_API_ROOT,
        prepareHeaders: async (headers) => {
            const token = await SecureStore.getItemAsync("token")
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),

    endpoints: (builder) => ({
        authRequest: builder.mutation<any, AuthRequestInterface>({
            query: ({ phone }) => ({
                url: "auth/request",
                method: "POST",
                body: {
                    phone: phone,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        auth: builder.mutation<any, AuthInterface>({
            query: ({ phone, code, phone_id, one_time_key }) => ({
                url: "auth",
                method: "POST",
                body: {
                    phone: phone,
                    code: code,
                    phone_id: phone_id,
                    one_time_key: one_time_key,
                },
                // transformResponse: (response: ResponseType) => {
                //     if (response.data.data.token) {
                //         SecureStore.setItemAsync("token", response.data.data.token);
                //     }
                //     return response;
                // }
                transformResponse: (response: ResponseType) => response.data.data,
            }),
        }),

        authAdminAccess: builder.mutation<any, AuthRequestInterface>({
            query: ({ phone }) => ({
                url: "auth/access",
                method: "POST",
                body: {
                    phone: phone,
                },
                transformResponse: (response: ResponseType) => response.data.data,
                invalidatesTags: ["UserMe"],
            }),
        }),

        updateUserMe: builder.mutation<any, UpdateUserInterface>({
            query: ({ first_name, last_name }) => ({
                url: "users/me",
                method: "PUT",
                body: {
                    first_name: first_name,
                    last_name: last_name,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ["UserMe"],
        }),

        updateUserRating: builder.mutation<any, any>({
            query: ({ type, rating, comment }) => ({
                url: "users/me/rating",
                method: "PUT",
                body: {
                    type: type,
                    rating: rating,
                    comment: comment,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserSurveys: builder.query<SurveyInterface, void>({
            query: () => ({
                url: "users/me/surveys",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserSurveyResponse: builder.mutation<any, { invitation_id: string | undefined }>({
            query: ({ invitation_id }) => ({
                url: "users/me/survey",
                method: "POST",
                body: { invitation_id: invitation_id },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        declineSurvey: builder.mutation<any, { invitation_id: string | undefined }>({
            query: ({ invitation_id }) => ({
                url: "users/me/survey/participation",
                method: "POST",
                body: { invitation_id: invitation_id },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        // updateUserFlag: builder.mutation<UserInterface, any>({
        //     query: () => ({
        //         url: "users/me/flag",
        //         method: "PUT",
        //     }),
        //     transformResponse: (response: ResponseType) => response.data,
        //     invalidatesTags: ["UserMe"],
        // }),

        renewWarranty: builder.mutation<WarrantyInterface, { name: string; email: string }>({
            query: ({ name, email }) => ({
                url: "users/me/warranty",
                method: "POST",
                body: {
                    name: name,
                    email: email,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        updateFavoriteProperties: builder.mutation<string[], { project_name: string }>({
            query: ({ project_name }) => ({
                url: "users/me/properties/favorite",
                method: "PUT",
                body: {
                    project_name: project_name,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ["UserMe"],
        }),

        createTicket: builder.mutation<TicketInterface, CreateTicketInterface>({
            query: ({ subject, description, property_id, imageLinks, sub_type, extra_types }) => ({
                url: "users/me/tickets",
                method: "POST",
                body: {
                    subject: subject,
                    description: description,
                    property_id: property_id,
                    photo: imageLinks,
                    sub_type: sub_type,
                    extra_types: extra_types,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ["UserMe"],
        }),

        getUserMe: builder.query<UserInterface, any>({
            query: () => ({
                url: "users/me",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ["UserMe"],
        }),

        getUserDocuments: builder.query<UserDocumentInterface[], any>({
            query: () => ({
                url: "users/me/documents",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ["UserMe"],
        }),
        getUserDocument: builder.query<UserDocumentInterface, { documentId: number; versionDataId: number }>({
            query: ({ documentId, versionDataId }) => ({
                url: `users/me/documents/${documentId}/files/${versionDataId}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserProperties: builder.query<PropertyDataInterface[], any>({
            query: () => ({
                url: "users/me/properties",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserTickets: builder.query<TicketInterface[], any>({
            query: () => ({
                url: "users/me/tickets",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ["UserMe"],
        }),

        getUserTicket: builder.query<any, number>({
            query: (ticket_id) => ({
                url: `users/me/tickets/${ticket_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ["UserMe"],
        }),

        getUserProperty: builder.query<PropertyDataInterface, number>({
            query: (property_id) => ({
                url: `users/me/properties/${property_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
            providesTags: ["UserMe"],
        }),

        getUserPayments: builder.query<any[], number>({
            query: (property_id) => ({
                url: `users/me/payments`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserInvoices: builder.query<InvoiceInterface[], any>({
            query: () => ({
                url: `users/me/invoices`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserInvoice: builder.query<InvoiceInterface, number>({
            query: (invoice_id) => ({
                url: `users/me/invoices/${invoice_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserInvoiceDocuments: builder.query<InvoiceInterface, { invoiceId: number | undefined; versionDataId: number }>({
            query: ({ invoiceId, versionDataId }) => ({
                url: `users/me/invoices/${invoiceId}/files/${versionDataId}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        updateUserNotificationsPreferences: builder.mutation<any, UserNotificationsPreferences>({
            query: ({ ticket_notification, property_notification, appointment_notification, document_notification, profile_notification }) => ({
                url: "users/me/notifications/preferences",
                method: "PUT",
                body: {
                    ticket_notification: ticket_notification,
                    property_notification: property_notification,
                    appointment_notification: appointment_notification,
                    document_notification: document_notification,
                    profile_notification: profile_notification,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ["UserMe"],
        }),

        requestFile: builder.mutation<{ file: string; url: string }, string>({
            query: (folder) => ({
                url: "users/me/files",
                method: "POST",
                body: {
                    content_type: "image/png",
                    private: false,
                    folder: folder,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        updateUserImage: builder.mutation<any, string>({
            query: (image) => ({
                url: "users/me/image",
                method: "PUT",
                body: {
                    image: image,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,

            invalidatesTags: ["UserMe"],
        }),

        /* updateTicketPicture: builder.mutation<any, any>({
            query: ({ photos, ticketId }) => ({
                url: "users/me/ticket/picture",
                method: "PUT",
                body: {
                    photos: photos,
                    ticketId: ticketId,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
            invalidatesTags: ["UserMe"],
        }), */

        getAppointments: builder.query<any, AvailableAppointments>({
            query: ({ type_of_visit, date, property_id }) => ({
                url: `appointments/type_of_visit=${type_of_visit}&date=${date}&property_id=${property_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getAvailabilitiesPerMonth: builder.query<any[], AvailabilitiesPerMonth>({
            query: ({ type_of_visit, year, month, property_id }) => ({
                url: `/users/me/appointments/type_of_visit=${type_of_visit}&year=${year}&month=${month}&property_id=${property_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getUserAppointments: builder.query<UserAppointment[], any>({
            query: () => ({
                url: "users/me/appointments",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        createAppointment: builder.mutation<UserAppointment[], any>({
            query: ({ date, property_id, type_of_visit, content, agent_id }: UserAppointment) => ({
                url: `users/me/appointment`,
                method: "POST",
                body: {
                    date: date,
                    property_id: property_id,
                    type_of_visit: type_of_visit,
                    content: content,
                    agent_id: agent_id,
                },
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        cancelAppointment: builder.mutation<any[], any>({
            query: (id: number) => ({
                url: `users/me/appointments/${id}`,
                method: "PUT",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        getPropertyTypeOfVisit: builder.query<string[], number>({
            query: (property_id) => ({
                url: `users/me/appointment/property?property_id=${property_id}`,
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        //push token registration

        pushTokenRegistration: builder.mutation<any, PushTokenRegistration>({
            query: (data) => ({
                url: "users/me/pushs",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),

        pushTokenUnregistration: builder.mutation<any, PushTokenUnregistration>({
            query: (data) => ({
                url: "users/me/pushs",
                method: "DELETE",
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        userPhoneCodeRequest: builder.mutation<any, UserPhoneCodeRequestInterface>({
            query: ({ phone }) => ({
                url: "users/me/phone/code/request",
                method: "POST",
                body: { phone: phone },
            }),
        }),
        updateContactPhoneInfo: builder.mutation<any, UserPhoneUpdateInterface>({
            query: (data) => ({
                url: "users/me/phone",
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        userEmailCodeRequest: builder.mutation<any, UserEmailCodeRequestInterface>({
            query: ({ email }) => ({
                url: "users/me/email/code/request",
                method: "POST",
                body: { email: email },
            }),
        }),
        updateContactEmailInfo: builder.mutation<any, UserEmailUpdateInterface>({
            query: (data) => {
                return {
                    url: "users/me/email",
                    method: "PUT",
                    body: data,
                }
            },
            transformResponse: (response: ResponseType) => response.data,
        }),

        updateUserLanguage: builder.mutation<any, { language_id: number }>({
            query: ({ language_id }) => ({
                url: "users/me/language",
                method: "PUT",
                body: { language_id: language_id },
            }),
        }),
        getUserNotifications: builder.query<UserNotification[], void>({
            query: () => ({
                url: "users/me/notifications",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        showAnnouncementvideo: builder.query<boolean, void>({
            query: () => ({
                url: "users/me/notifications/announcement",
                method: "GET",
            }),
            transformResponse: (response: ResponseType) => response.data,
        }),
        openUserNotifications: builder.mutation<UserNotification[], number>({
            query: (id) => {
                return {
                    url: `users/me/notifications/${id}`,
                    method: "PUT",
                    body: {},
                }
            },
            transformResponse: (response: ResponseType) => response.data,
        }),

        clearUserNotifications: builder.mutation<any, any>({
            query: () => {
                return {
                    url: "users/me/notifications",
                    method: "PUT",
                    body: {},
                }
            },
            transformResponse: (response: ResponseType) => response.data,
        }),
    }),
})

export const {
    useGetArticlesQuery,
    useGetPropertiesQuery,
    useLazyGetPropertiesQuery,
    useGetBannersQuery,
    useLazyGetArticlesQuery,
    useLazyGetBannersQuery,
    useRegisterPropertyInterestMutation,
} = API_WP

export const {
    useAuthRequestMutation,
    useAuthMutation,
    useAuthAdminAccessMutation,
    useUpdateUserMeMutation,
    //useUpdateUserFlagMutation,
    useGetUserMeQuery,
    useGetUserDocumentsQuery,
    useGetUserDocumentQuery,
    useGetUserPropertiesQuery,
    useGetUserTicketsQuery,
    useGetUserTicketQuery,
    useGetUserPropertyQuery,
    useUpdateUserImageMutation,
    useGetUserAppointmentsQuery,
    useUpdateUserRatingMutation,
    useGetUserSurveysQuery,
    useGetUserSurveyResponseMutation,
    useDeclineSurveyMutation,
    useUpdateFavoritePropertiesMutation,
    useRequestFileMutation,

    useGetUserInvoicesQuery,
    useGetUserInvoiceQuery,
    useGetUserInvoiceDocumentsQuery,
    useGetUserPaymentsQuery,
    useGetAppointmentsQuery,
    useGetAvailabilitiesPerMonthQuery,
    useCreateAppointmentMutation,
    useCancelAppointmentMutation,
    useGetPropertyTypeOfVisitQuery,
    useGetUserNotificationsQuery,
    useShowAnnouncementvideoQuery,
    useOpenUserNotificationsMutation,

    useLazyGetUserPropertiesQuery,
    useLazyGetUserDocumentsQuery,
    useLazyGetUserInvoiceDocumentsQuery,
    useLazyGetUserDocumentQuery,
    useLazyGetUserTicketsQuery,

    useUpdateUserNotificationsPreferencesMutation,
    useRenewWarrantyMutation,

    useCreateTicketMutation,
    useUpdateContactPhoneInfoMutation,
    usePushTokenRegistrationMutation,
    usePushTokenUnregistrationMutation,
    useUserPhoneCodeRequestMutation,
    useUpdateContactEmailInfoMutation,
    useUserEmailCodeRequestMutation,
    useUpdateUserLanguageMutation,
    useClearUserNotificationsMutation,
} = API_RETAL
