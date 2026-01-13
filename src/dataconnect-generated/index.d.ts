import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateCrisisPlanData {
  crisisPlan_insert: CrisisPlan_Key;
}

export interface CreateCrisisPlanVariables {
  name: string;
  description: string;
  crisisType?: string | null;
  isPublic: boolean;
}

export interface CrisisPlan_Key {
  id: UUIDString;
  __typename?: 'CrisisPlan_Key';
}

export interface GetMyTasksData {
  tasks: ({
    id: UUIDString;
    description: string;
    status: string;
    dueDate?: TimestampString | null;
    incident: {
      id: UUIDString;
      title: string;
    } & Incident_Key;
  } & Task_Key)[];
}

export interface Incident_Key {
  id: UUIDString;
  __typename?: 'Incident_Key';
}

export interface ListPublicCrisisPlansData {
  crisisPlans: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    crisisType?: string | null;
    creator: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & CrisisPlan_Key)[];
}

export interface Role_Key {
  id: UUIDString;
  __typename?: 'Role_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateTaskStatusData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateCrisisPlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCrisisPlanVariables): MutationRef<CreateCrisisPlanData, CreateCrisisPlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCrisisPlanVariables): MutationRef<CreateCrisisPlanData, CreateCrisisPlanVariables>;
  operationName: string;
}
export const createCrisisPlanRef: CreateCrisisPlanRef;

export function createCrisisPlan(vars: CreateCrisisPlanVariables): MutationPromise<CreateCrisisPlanData, CreateCrisisPlanVariables>;
export function createCrisisPlan(dc: DataConnect, vars: CreateCrisisPlanVariables): MutationPromise<CreateCrisisPlanData, CreateCrisisPlanVariables>;

interface ListPublicCrisisPlansRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicCrisisPlansData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicCrisisPlansData, undefined>;
  operationName: string;
}
export const listPublicCrisisPlansRef: ListPublicCrisisPlansRef;

export function listPublicCrisisPlans(): QueryPromise<ListPublicCrisisPlansData, undefined>;
export function listPublicCrisisPlans(dc: DataConnect): QueryPromise<ListPublicCrisisPlansData, undefined>;

interface UpdateTaskStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  operationName: string;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;

export function updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface GetMyTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyTasksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyTasksData, undefined>;
  operationName: string;
}
export const getMyTasksRef: GetMyTasksRef;

export function getMyTasks(): QueryPromise<GetMyTasksData, undefined>;
export function getMyTasks(dc: DataConnect): QueryPromise<GetMyTasksData, undefined>;

