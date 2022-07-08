import { useCallback } from "react";

const useHttp = () => {
  const get = useCallback(
    async <ReturnType>(
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ): Promise<ReturnType> => {
      const response = await fetch(input, {
        ...init,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
        ...init,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
        ...init,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
        ...init,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
