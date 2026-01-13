import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'environmenttech',
  location: 'us-east4'
};

export const createCrisisPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCrisisPlan', inputVars);
}
createCrisisPlanRef.operationName = 'CreateCrisisPlan';

export function createCrisisPlan(dcOrVars, vars) {
  return executeMutation(createCrisisPlanRef(dcOrVars, vars));
}

export const listPublicCrisisPlansRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicCrisisPlans');
}
listPublicCrisisPlansRef.operationName = 'ListPublicCrisisPlans';

export function listPublicCrisisPlans(dc) {
  return executeQuery(listPublicCrisisPlansRef(dc));
}

export const updateTaskStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTaskStatus', inputVars);
}
updateTaskStatusRef.operationName = 'UpdateTaskStatus';

export function updateTaskStatus(dcOrVars, vars) {
  return executeMutation(updateTaskStatusRef(dcOrVars, vars));
}

export const getMyTasksRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyTasks');
}
getMyTasksRef.operationName = 'GetMyTasks';

export function getMyTasks(dc) {
  return executeQuery(getMyTasksRef(dc));
}

