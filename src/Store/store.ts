// store.js
import { configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

// import userSlice from './Slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API } from '../Services/API'

const persistConfig = {
    key: 'root', // The key under which your state will be stored
    storage: AsyncStorage, // Use AsyncStorage
    // Add any additional configuration options as needed
}

//const rootReducer = combineReducers({
// language: languageReducer,
//[API.reducerPath]: API.reducer,
//});

//const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(API.middleware),
// });
export const store = configureStore({
    reducer: {
        [API.reducerPath]: API.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(API.middleware), // Include both API middlewares here
})

export const persistor = persistStore(store)
