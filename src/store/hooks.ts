/**
 * Typed Redux Hooks
 *
 * Use these instead of plain useSelector/useDispatch for type safety.
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/src/redux2/Store';

// Typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();
