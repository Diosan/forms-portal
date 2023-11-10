import _ from 'lodash';

import { configureStore } from '@reduxjs/toolkit'

import formReducer from './forms/formReducer'

const reducer = {
  forms: formReducer
}

export const store = configureStore({reducer})