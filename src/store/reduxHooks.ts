// src/store/reduxHooks.ts

import { useDispatch as reduxUseDispatch } from 'react-redux';
import { useAppDispatch } from '../store'; 

// Typed useDispatch hook
export const useDispatch = () => reduxUseDispatch<useAppDispatch>();
