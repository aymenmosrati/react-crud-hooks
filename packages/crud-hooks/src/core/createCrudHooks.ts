import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { CrudOptions, EntityId } from "../types/types";

export function createCrudHooks<T = any>(options: CrudOptions<T>) {
  const {
    baseUrl,
    entityKey,
    axiosInstance = axios,
    customUrls,
    transformers,
    mappers,
    invalidate,
    queryOptions,
    mutationOptions,
  } = options;

  const useGetMany = (params?: Record<string, any>): UseQueryResult<T[]> => {
    return useQuery({
      queryKey: [entityKey, params],
      queryFn: async (): Promise<T[]> => {
        const query = new URLSearchParams(params || {}).toString();
        const url =
          customUrls?.getMany?.() || (query ? `${baseUrl}?${query}` : baseUrl);
        const res = await axiosInstance.get<T[]>(url);
        return transformers?.output?.getMany
          ? transformers.output.getMany(res?.data)
          : res?.data;
      },
      ...queryOptions?.useGetMany,
    });
  };

  const useGetOne = (id: EntityId) => {
    return useQuery({
      queryKey: [entityKey, id],
      queryFn: async () => {
        const url = customUrls?.getOne?.(id) || `${baseUrl}/${id}`;
        const res = await axiosInstance.get<T>(url);
        return transformers?.output?.getOne
          ? transformers.output.getOne(res.data)
          : res.data;
      },
      ...queryOptions?.useGetOne,
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: T) => {
        const body = transformers?.input?.create
          ? transformers.input.create(data)
          : data;
        const url = customUrls?.create?.() || baseUrl;
        return axiosInstance.post(url, body);
      },
      onSuccess: (data) => {
        if (invalidate?.afterCreate) {
          const keys =
            typeof invalidate.afterCreate === "function"
              ? invalidate.afterCreate(data)
              : invalidate.afterCreate;
          keys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
        } else {
          queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
      },
      ...mutationOptions?.create,
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, ...data }: any) => {
        const body = transformers?.input?.update
          ? transformers.input.update(data)
          : data;
        const url = customUrls?.update?.(id) || `${baseUrl}/${id}`;
        return axiosInstance.put(url, body);
      },
      onSuccess: (data) => {
        if (invalidate?.afterUpdate) {
          const keys =
            typeof invalidate.afterUpdate === "function"
              ? invalidate.afterUpdate(data)
              : invalidate.afterUpdate;
          keys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
        } else {
          queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
      },
      ...mutationOptions?.update,
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: EntityId) => {
        const url = customUrls?.delete?.(id) || `${baseUrl}/${id}`;
        return axiosInstance.delete(url);
      },
      onSuccess: (data) => {
        if (invalidate?.afterDelete) {
          const keys =
            typeof invalidate.afterDelete === "function"
              ? invalidate.afterDelete(data)
              : invalidate.afterDelete;
          keys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
        } else {
          queryClient.invalidateQueries({ queryKey: [entityKey] });
        }
      },
      ...mutationOptions?.delete,
    });
  };

  return {
    useGetMany,
    useGetOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}
