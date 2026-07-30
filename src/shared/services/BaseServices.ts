import type { PaginatedResponse, SelectOption } from "@/app/providers";
import apiClient from "@/lib/axios";
import type { AxiosInstance } from "axios";

export interface BaseServiceConfig<
    TEntity, //Type of main entity(ex: Ritual, User,...)
    TCreateDto, //Type of Data when CREATE
    TUpdateDto, //Type of data when UPDATE
    TFilterParams, //Type of params when FILTER/SEARCH
> {
    endpoint: string; //Base URL path (VD: "/ritual", )
    axios?: AxiosInstance; // Optional: Custom axios instance

    getAll?: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
    getById?: (id: string | number) => Promise<TEntity>;
    create?: (data: TCreateDto) => Promise<TEntity>;
    update?: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
    remove?: (id: string | number) => Promise<void>;
    getSelectOptions?: () => Promise<SelectOption[]>;
}

export interface BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
    getAll: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
    getById: (id: string | number) => Promise<TEntity>;
    create: (data: TCreateDto) => Promise<TEntity>;
    update: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
    remove: (id: string | number) => Promise<void>;
    getSelectOptions: () => Promise<SelectOption[]>;
}

export function createBaseService<
    TEntity,
    TCreateDto = Partial<TEntity>,
    TUpdateDto = Partial<TEntity>,
    TFilterParams = Record<string, unknown>
>(
    config: BaseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams>
): BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
    const axios = config.axios ?? apiClient;
    const endpoint = config.endpoint;

    return {
        getAll:
            config.getAll ??
            (async (params?: TFilterParams) => {
                return axios.get<PaginatedResponse<TEntity>>(endpoint, {
                    params,
                }) as unknown as Promise<PaginatedResponse<TEntity>>;
            }),
        getById:
            config.getById ??
            (async (id: string | number) => {
                return axios.get<TEntity>(
                    `${endpoint}/${id}`,
                ) as unknown as Promise<TEntity>;
            }),
        create:
            config.create ??
            (async (dto: TCreateDto) => {
                return axios.post<TEntity>(
                    endpoint,
                    dto,
                ) as unknown as Promise<TEntity>;
            }),
        update:
            config.update ??
            (async (id: string | number, dto: TUpdateDto) => {
                return axios.put<TEntity>(
                    `${endpoint}/${id}`,
                    dto,
                ) as unknown as Promise<TEntity>;

            }),
        remove:
            config.remove ??
            (async (id: string | number) => {
                await axios.delete(`${endpoint}/${id}`);
            }),

        getSelectOptions:
            config.getSelectOptions ??
            (async () => {
                return axios.get<SelectOption[]>(
                    `${endpoint}/select`,
                ) as unknown as Promise<SelectOption[]>;
            }),
    }
}