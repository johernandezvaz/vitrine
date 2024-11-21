import { useState, useEffect } from "react";

/**
 * Hook personalizado para realizar peticiones HTTP.
 * @param url URL de la API.
 * @param options Opciones de la petición (opcional).
 * @returns Objeto con los datos, estado de carga y errores.
 */
const useFetch = <T,>(
  url: string,
  options?: RequestInit
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
} => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        setError((err as Error).message || "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, isLoading, error };
};

export default useFetch;
