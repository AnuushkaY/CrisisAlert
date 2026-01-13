const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'environmenttech',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createCrisisPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCrisisPlan', inputVars);
}
createCrisisPlanRef.operationName = 'CreateCrisisPlan';
exports.createCrisisPlanRef = createCrisisPlanRef;

exports.createCrisisPlan = function createCrisisPlan(dcOrVars, vars) {
  return executeMutation(createCrisisPlanRef(dcOrVars, vars));
};

const listPublicCrisisPlansRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicCrisisPlans');
}
listPublicCrisisPlansRef.operationName = 'ListPublicCrisisPlans';
exports.listPublicCrisisPlansRef = listPublicCrisisPlansRef;

exports.listPublicCrisisPlans = function listPublicCrisisPlans(dc) {
  return executeQuery(listPublicCrisisPlansRef(dc));
};

const updateTaskStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTaskStatus', inputVars);
}
updateTaskStatusRef.operationName = 'UpdateTaskStatus';
exports.updateTaskStatusRef = updateTaskStatusRef;

exports.updateTaskStatus = function updateTaskStatus(dcOrVars, vars) {
  return executeMutation(updateTaskStatusRef(dcOrVars, vars));
};

const getMyTasksRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyTasks');
}
getMyTasksRef.operationName = 'GetMyTasks';
exports.getMyTasksRef = getMyTasksRef;

exports.getMyTasks = function getMyTasks(dc) {
  return executeQuery(getMyTasksRef(dc));
};
