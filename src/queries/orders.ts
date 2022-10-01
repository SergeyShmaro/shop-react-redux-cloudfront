import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { OrderStatus } from "~/constants/order";
import { Order } from "~/models/Order";

export function useOrders() {
  return { data: [] };
  return useQuery<Order[], AxiosError>("orders", async () => {
    // @ts-expect-error cart route is temporary unavailable
    const res = await axios.get<Order[]>(`${API_PATHS.order}/order`);
    return res.data;
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("orders", { exact: true }),
    []
  );
}

export function useUpdateOrderStatus() {
  return { mutateAsync: () => undefined };
  return useMutation(
    (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      // @ts-expect-error cart route is temporary unavailable
      return axios.put(`${API_PATHS.order}/order/${id}/status`, data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
    }
  );
}

export function useSubmitOrder() {
  return { mutate: () => undefined };
  return useMutation((values: Omit<Order, "id">) => {
    // @ts-expect-error cart route is temporary unavailable
    return axios.put<Omit<Order, "id">>(`${API_PATHS.order}/order`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    });
  });
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) =>
      queryClient.invalidateQueries(["order", { id }], { exact: true }),
    []
  );
}

export function useDeleteOrder() {
  return { mutate: () => undefined };
  return useMutation((id: string) =>
    // @ts-expect-error cart route is temporary unavailable
    axios.delete(`${API_PATHS.order}/order/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
