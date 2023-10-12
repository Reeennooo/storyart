import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface modalAuthState {
  isOpenAuthModal: boolean
  selectedSection: string
  forgotPassword: boolean
  isOpenVerifiedModal: boolean
  confirmEmail: boolean
  licenseModal: boolean
  newPassModal: boolean
}

const initialState: modalAuthState = {
  isOpenAuthModal: false,
  selectedSection: '',
  forgotPassword: false,
  isOpenVerifiedModal: false,
  confirmEmail: false,
  licenseModal: false,
  newPassModal: false,
}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openAuthModal: (
      state: modalAuthState,
      { payload }: PayloadAction<[boolean, string]>
    ) => {
      const [isOpen, name] = payload
      state.isOpenAuthModal = isOpen
      state.selectedSection = name
    },
    setForgotPassword: (
      state: modalAuthState,
      { payload }: PayloadAction<[boolean, string]>
    ) => {
      const [isOpen, name] = payload
      state.forgotPassword = isOpen
      state.selectedSection = name
    },
    openVerifiedModal: (state, action) => {
      state.isOpenVerifiedModal = action.payload
    },
    openConfirmEmail: (state, action) => {
      state.confirmEmail = action.payload
    },
    openLicenseModal: (state, action) => {
      state.licenseModal = action.payload
    },
    openNewPassModal: (state, action) => {
      state.newPassModal = action.payload
    },
  },
})

export const {
  openAuthModal,
  setForgotPassword,
  openVerifiedModal,
  openConfirmEmail,
  openLicenseModal,
  openNewPassModal,
} = modalsSlice.actions
