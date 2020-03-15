import { useCallback, useState } from "react";

export const useHttpsClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  let responseData;

  const clearError = () => {
    setIsError(null);
  };

  const submitRequest = useCallback(
    async (URL, method = "GET", headers = {}, body = null) => {
      try {
        setIsLoading(true);
        const response = await fetch(URL, {
          method: method,
          headers: headers,
          body: body
        });

        responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setIsError(err.message || "something went wrong in FT");
        throw err;
      }
    },
    []
  );

  return [isLoading, isError, submitRequest, clearError];
};
