import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  CreateBugReportRequest,
  BugReportResponse,
} from '@/src/types/api/bugReport.types';

export const bugReportApi = createApi({
  reducerPath: 'bugReportApi',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
  
    createBugReport: builder.mutation<ApiResponse<BugReportResponse>, CreateBugReportRequest>({
      query: (body) => ({
        url: '/bug-reports',
        method: 'POST',
        body,
      }),
    }),


    uploadBugReportImage: builder.mutation<ApiResponse<BugReportResponse>, { bugReportId: string; formData: FormData }>({
      query: ({ bugReportId, formData }) => ({
        url: `/bug-reports/${bugReportId}/image`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateBugReportMutation,
  useUploadBugReportImageMutation,
} = bugReportApi;
