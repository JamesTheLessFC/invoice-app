// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/" }),
  tagTypes: ["Invoices"],
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: ({ page = 1, filters = [] }) =>
        `invoices?${
          filters.length > 0
            ? `filter=${filters.length > 1 ? filters.join(",") : filters[0]}&`
            : ""
        }page=${page}`,
      // Provides a list of `Invoices` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" I just made up to be able to invalidate this query specifically if a new `Invoices` element was added.
      providesTags: (result) =>
        // is result available?
        result && Array.isArray(result)
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Invoices", id })),
              { type: "Invoices", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Invoices', id: 'LIST' }` is invalidated
            [{ type: "Invoices", id: "LIST" }],
    }),
    addInvoice: builder.mutation({
      query: (invoice) => ({
        url: "invoice",
        method: "POST",
        body: invoice,
      }),
      invalidatesTags: [{ type: "Invoices", id: "LIST" }],
    }),
    getInvoiceById: builder.query({
      query: (id) => `invoice/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),
    updateInvoiceById: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `invoice/${id}`,
        method: "PUT",
        body,
      }),
      // Invalidates all queries that subscribe to this Invoice `id` only.
      // In this case, `getInvoice` will be re-run. `getInvoices` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoices", id },
        { type: "Invoices", id: "LIST" },
      ],
    }),
    deleteInvoiceById: builder.mutation({
      query: (id) => ({ url: `invoice/${id}`, method: "DELETE" }),
      // Invalidates all queries that subscribe to this Invoice `id` only.
      invalidatesTags: (result, error, id) => [
        // { type: "Invoices", id },
        { type: "Invoices", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceByIdMutation,
  useDeleteInvoiceByIdMutation,
} = invoiceApi;
