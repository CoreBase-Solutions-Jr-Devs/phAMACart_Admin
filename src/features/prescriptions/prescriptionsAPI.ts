import { apiClient } from "@/app/api-client";

import {
  GetPendingPrescriptionsParams,
  GetPendingPrescriptionsResponse,
  GetPrescriptionByIdResponse,
  ApprovePrescriptionRequest,
  ApprovePrescriptionResponse,
  RejectPrescriptionRequest,
  RejectPrescriptionResponse,
  SearchPrescriptionProductsParams,
  SearchPrescriptionProductsResponse,
  TranscribePrescriptionDetailsRequest,
  TranscribePrescriptionDetailsResponse,
} from "./prescriptionsType";

export const prescriptionsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getPendingPrescriptions: builder.query<
      GetPendingPrescriptionsResponse,
      GetPendingPrescriptionsParams | void
    >({
      query: (params) => ({
        url: "/admin/prescriptions/pending",
        method: "GET",
        params: {
          pageNumber: params?.pageNumber ?? 1,
          pageSize: params?.pageSize ?? 20,
        },
      }),

      providesTags: ["prescriptions"],
    }),

    getPrescriptionById: builder.query<
      GetPrescriptionByIdResponse,
      string
    >({
      query: (id) => ({
        url: `/prescriptions/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "prescriptions",
          id,
        },
      ],
    }),

    searchPrescriptionProducts: builder.query<
      SearchPrescriptionProductsResponse,
      SearchPrescriptionProductsParams
    >({
      query: (params) => ({
        url: "/admin/prescriptions/products/search",
        method: "GET",
        params: {
          query: params.query,
        },
      }),
    }),

    transcribePrescriptionDetails: builder.mutation<
      TranscribePrescriptionDetailsResponse,
      TranscribePrescriptionDetailsRequest
    >({
      query: (body) => ({
        url: "/admin/prescriptions/transcribe",
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, body) => [
        "prescriptions",
        { type: "prescriptions", id: body.prescriptionId },
      ],
    }),

    approvePrescription: builder.mutation<
      ApprovePrescriptionResponse,
      ApprovePrescriptionRequest
    >({
      query: (body) => ({
        url: "/admin/prescriptions/approve",
        method: "POST",
        body,
      }),

      invalidatesTags: ["prescriptions"],
    }),

    rejectPrescription: builder.mutation<
      RejectPrescriptionResponse,
      RejectPrescriptionRequest
    >({
      query: (body) => ({
        url: "/admin/prescriptions/reject",
        method: "POST",
        body,
      }),

      invalidatesTags: ["prescriptions"],
    }),
  }),
});

export const {
  useGetPendingPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useSearchPrescriptionProductsQuery,
  useLazySearchPrescriptionProductsQuery,
  useTranscribePrescriptionDetailsMutation,
  useApprovePrescriptionMutation,
  useRejectPrescriptionMutation,
} = prescriptionsApi;