import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { TenantConfig } from "./tenantsAPI";

interface TenantState {
  currentTenant: TenantConfig | null;
  initialized: boolean;
}

const initialState: TenantState = {
  currentTenant: null,
  initialized: false,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (
      state,
      action: PayloadAction<TenantConfig>,
    ) => {
      state.currentTenant = action.payload;
      state.initialized = true;
    },

    clearTenant: (state) => {
      state.currentTenant = null;
      state.initialized = true;
    },
  },
});

export const {
  setTenant,
  clearTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;