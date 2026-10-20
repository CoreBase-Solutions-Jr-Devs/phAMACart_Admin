import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";

import {
  GetPendingPrescriptionsParams,
  GetPendingPrescriptionsResponse,
  ApprovePrescriptionRequest,
  ApprovePrescriptionResponse,
  RejectPrescriptionRequest,
  RejectPrescriptionResponse,
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
        url: `${ADMIN}/admin/prescriptions/pending`,
        method: "GET",
        params: {
          pageNumber: params?.pageNumber ?? 1,
          pageSize: params?.pageSize ?? 20,
        },
      }),

      providesTags: ["prescriptions"],
    }),

    transcribePrescriptionDetails: builder.mutation<
      TranscribePrescriptionDetailsResponse,
      TranscribePrescriptionDetailsRequest
    >({
      query: (body) => ({
        url: `${ADMIN}/admin/prescriptions/transcribe`,
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
        url: `${ADMIN}/admin/prescriptions/approve`,
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
        url: `${ADMIN}/admin/prescriptions/reject`,
        method: "POST",
        body,
      }),

      invalidatesTags: ["prescriptions"],
    }),
  }),
});

export const {
  useGetPendingPrescriptionsQuery,
  useTranscribePrescriptionDetailsMutation,
  useApprovePrescriptionMutation,
  useRejectPrescriptionMutation,
} = prescriptionsApi;