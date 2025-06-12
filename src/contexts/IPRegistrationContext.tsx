import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Address } from 'viem';
import { IPAssetType } from '../config/storyProtocolConfig';

// Types
export interface RegistrationResult {
  tbaAddress: Address;
  ipId: string;
  contentUrl: string;
  metadataUrl: string;
}

interface IPRegistrationState {
  currentTokenId: bigint;
  pendingRegistrations: Map<bigint, {
    status: 'pending' | 'completed' | 'failed';
    result?: RegistrationResult;
    error?: string;
  }>;
  lastRegisteredIP: RegistrationResult | null;
}

type IPRegistrationAction =
  | { type: 'SET_TOKEN_ID'; payload: bigint }
  | { type: 'START_REGISTRATION'; payload: bigint }
  | { type: 'REGISTRATION_SUCCESS'; payload: { tokenId: bigint; result: RegistrationResult } }
  | { type: 'REGISTRATION_FAILURE'; payload: { tokenId: bigint; error: string } }
  | { type: 'RESET_STATE' };

interface IPRegistrationContextType extends IPRegistrationState {
  setCurrentTokenId: (tokenId: bigint) => void;
  startRegistration: (tokenId: bigint) => void;
  completeRegistration: (tokenId: bigint, result: RegistrationResult) => void;
  failRegistration: (tokenId: bigint, error: string) => void;
  resetState: () => void;
}

// Initial state
const initialState: IPRegistrationState = {
  currentTokenId: 1n,
  pendingRegistrations: new Map(),
  lastRegisteredIP: null,
};

// Context
const IPRegistrationContext = createContext<IPRegistrationContextType | undefined>(undefined);

// Reducer
function ipRegistrationReducer(
  state: IPRegistrationState,
  action: IPRegistrationAction
): IPRegistrationState {
  switch (action.type) {
    case 'SET_TOKEN_ID':
      return {
        ...state,
        currentTokenId: action.payload,
      };
    case 'START_REGISTRATION':
      const newPendingMap = new Map(state.pendingRegistrations);
      newPendingMap.set(action.payload, { status: 'pending' });
      return {
        ...state,
        pendingRegistrations: newPendingMap,
      };
    case 'REGISTRATION_SUCCESS':
      const successMap = new Map(state.pendingRegistrations);
      successMap.set(action.payload.tokenId, {
        status: 'completed',
        result: action.payload.result,
      });
      return {
        ...state,
        pendingRegistrations: successMap,
        lastRegisteredIP: action.payload.result,
        currentTokenId: state.currentTokenId + 1n,
      };
    case 'REGISTRATION_FAILURE':
      const failureMap = new Map(state.pendingRegistrations);
      failureMap.set(action.payload.tokenId, {
        status: 'failed',
        error: action.payload.error,
      });
      return {
        ...state,
        pendingRegistrations: failureMap,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Provider Component
export function IPRegistrationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ipRegistrationReducer, initialState);

  const setCurrentTokenId = (tokenId: bigint) => {
    dispatch({ type: 'SET_TOKEN_ID', payload: tokenId });
  };

  const startRegistration = (tokenId: bigint) => {
    dispatch({ type: 'START_REGISTRATION', payload: tokenId });
  };

  const completeRegistration = (tokenId: bigint, result: RegistrationResult) => {
    dispatch({
      type: 'REGISTRATION_SUCCESS',
      payload: { tokenId, result },
    });
  };

  const failRegistration = (tokenId: bigint, error: string) => {
    dispatch({
      type: 'REGISTRATION_FAILURE',
      payload: { tokenId, error },
    });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <IPRegistrationContext.Provider
      value={{
        ...state,
        setCurrentTokenId,
        startRegistration,
        completeRegistration,
        failRegistration,
        resetState,
      }}
    >
      {children}
    </IPRegistrationContext.Provider>
  );
}

// Hook for using the context
export function useIPRegistrationContext() {
  const context = useContext(IPRegistrationContext);
  if (context === undefined) {
    throw new Error('useIPRegistrationContext must be used within an IPRegistrationProvider');
  }
  return context;
}