import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import accusedReducer from "./slices/accused";
import chargesReducer from "./slices/charge";

import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";


// Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'message', 'charge'] // You can choose which slices to persist
};

// Combined Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  accused: accusedReducer,
  charge: chargesReducer,

});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

// Persistor
const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
