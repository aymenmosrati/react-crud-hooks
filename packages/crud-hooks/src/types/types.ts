import {
  QueryClient,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export type SqlId = number | string;
export type NoSqlId = string | { $oid: string } | any;
export type EntityId = SqlId | NoSqlId;

export type Transformers<T> = {
  input?: {
    create?: (data: any) => any;
    update?: (data: any) => any;
  };
  output?: {
    getMany?: (res: any) => any;
    getOne?: (res: any) => any;
  };
};

export type Mappers<T> = {
  toServer?: (formData: any) => any;
  fromServer?: (dto: any) => any;
};

export type InvalidateRules<T> = {
  afterCreate?: string[] | ((data: T) => string[]);
  afterUpdate?: string[] | ((data: T) => string[]);
  afterDelete?: string[] | ((data: T) => string[]);
};

export type CrudOptions<T = any> = {
  baseUrl: string;
  entityKey: string;
  axiosInstance?: AxiosInstance;
  getHeaders?: () => Record<string, string>;
  needAuth?: boolean;

  customUrls?: {
    getMany?: () => string;
    getOne?: (id: EntityId) => string;
    create?: () => string;
    update?: (id: EntityId) => string;
    delete?: (id: EntityId) => string;
  };

  transformers?: Transformers<T>;
  mappers?: Mappers<T>;
  invalidate?: InvalidateRules<T>;

  queryOptions?: {
    useGetMany?: UseQueryOptions<T[]>;
    useGetOne?: UseQueryOptions<T>;
  };

  mutationOptions?: {
    create?: UseMutationOptions<any, any, any>;
    update?: UseMutationOptions<any, any, any>;
    delete?: UseMutationOptions<any, any, any>;
  };

  pagination?: {
    defaultLimit?: number;
    supportInfinite?: boolean;
  };

  errorHandler?: (error: any, context?: any) => void;
  queryKeyBuilder?: (params: { id?: any; params?: any }) => any[];
};

export type ReturnCrudHooks<T = any> = {
  useGetMany: (params?: Record<string, any>) => UseQueryResult<any>;
  useGetOne: (id: string | number) => UseQueryResult<any>;
  useCreate: () => UseMutationResult<any>;
  useUpdate: () => UseMutationResult<any>;
  useDelete: () => UseMutationResult<any>;
  useInfiniteGetMany?: (
    params?: Record<string, any>
  ) => UseInfiniteQueryResult<any>;
};

export type MultiCrudOptions = Record<string, CrudOptions>;
