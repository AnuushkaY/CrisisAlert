import { CreateCrisisPlanData, CreateCrisisPlanVariables, ListPublicCrisisPlansData, UpdateTaskStatusData, UpdateTaskStatusVariables, GetMyTasksData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateCrisisPlan(options?: useDataConnectMutationOptions<CreateCrisisPlanData, FirebaseError, CreateCrisisPlanVariables>): UseDataConnectMutationResult<CreateCrisisPlanData, CreateCrisisPlanVariables>;
export function useCreateCrisisPlan(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCrisisPlanData, FirebaseError, CreateCrisisPlanVariables>): UseDataConnectMutationResult<CreateCrisisPlanData, CreateCrisisPlanVariables>;

export function useListPublicCrisisPlans(options?: useDataConnectQueryOptions<ListPublicCrisisPlansData>): UseDataConnectQueryResult<ListPublicCrisisPlansData, undefined>;
export function useListPublicCrisisPlans(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicCrisisPlansData>): UseDataConnectQueryResult<ListPublicCrisisPlansData, undefined>;

export function useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;

export function useGetMyTasks(options?: useDataConnectQueryOptions<GetMyTasksData>): UseDataConnectQueryResult<GetMyTasksData, undefined>;
export function useGetMyTasks(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyTasksData>): UseDataConnectQueryResult<GetMyTasksData, undefined>;
