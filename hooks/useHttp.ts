import { useCallback } from "react";

const useHttp = (credentials?: boolean) => {
  const secureOptions = credentials
    ? {
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": document.cookie,
        },
      }
    : {};
  const get = useCallback(
    async <ReturnType>(
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ): Promise<ReturnType> => {
      const response = await fetch(input, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...init,
      });

      const data = await response.json();
      return <ReturnType>data;
    },
    []
  );

  const post = useCallback(
    async <T, R>(
      input: RequestInfo | URL,
      init?: RequestInit | undefined,
      body?: T
    ): Promise<R> => {
      const response = await fetch(input, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        ...init,
      });

      return response.json();
    },
    []
  );

  const put = useCallback(
    async <T, R>(
      input: RequestInfo | URL,
      init?: RequestInit | undefined,
      body?: T
    ): Promise<R> => {
      const response = await fetch(input, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        ...init,
      });

      return response.json();
    },
    []
  );

  const del = useCallback(
    async <T, R>(
      input: RequestInfo | URL,
      init?: RequestInit | undefined,
      body?: T
    ): Promise<R> => {
      const response = await fetch(input, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        ...init,
      });

      return response.json();
    },
    []
  );

  return {
    get,
    post,
    put,
    delete: del,
  };
};

export default useHttp;
