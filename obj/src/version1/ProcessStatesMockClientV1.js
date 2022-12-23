"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesMockClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const ProcessStatusV1_1 = require("./ProcessStatusV1");
const ProcessStatesManager_1 = require("./ProcessStatesManager");
const ProcessLockManager_1 = require("./ProcessLockManager");
const TasksManager_1 = require("./TasksManager");
const ProcessAlreadyExistExceptionV1_1 = require("./ProcessAlreadyExistExceptionV1");
const ProcessNotFoundExceptionV1_1 = require("./ProcessNotFoundExceptionV1");
const RecoveryManager_1 = require("./RecoveryManager");
class ProcessStatesMockClientV1 {
    constructor() {
        this._maxPageSize = 100;
        this._items = [];
    }
    toStringArray(value) {
        if (value == null)
            return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }
    matchSearch(status, search) {
        if (this.matchString(status.id, search))
            return true;
        if (this.matchString(status.type, search))
            return true;
        if (this.matchString(status.key, search))
            return true;
        if (this.matchString(status.status, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let status = filter.getAsNullableString('status');
        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        let key = filter.getAsNullableString('key');
        let recovered = filter.getAsNullableBoolean('recovered');
        let expired = filter.getAsNullableBoolean('expired');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let search = filter.getAsNullableString('search');
        let now = new Date().getTime();
        return (item) => {
            if (id && item.id != id)
                return false;
            if (type && item.type != type)
                return false;
            if (status && item.status != status)
                return false;
            if (statuses && statuses.indexOf(item.status) < 0)
                return false;
            if (key && item.key != key)
                return false;
            if (recovered == true && (item.recovery_time == null || item.recovery_time.getTime() >= now))
                return false;
            if (expired == true && (item.expiration_time == null || item.expiration_time.getTime() >= now))
                return false;
            if (fromTime && item.start_time.getTime() < fromTime.getTime())
                return false;
            if (toTime && item.start_time.getTime() > toTime.getTime())
                return false;
            if (search != null && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getProcesses(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterCurl = this.composeFilter(filter);
            let accounts = this._items.filter(filterCurl);
            // Extract a page
            paging = paging != null ? paging : new pip_services3_commons_nodex_1.PagingParams();
            let skip = paging.getSkip(-1);
            let take = paging.getTake(this._maxPageSize);
            let total = null;
            if (paging.total)
                total = accounts.length;
            if (skip > 0)
                accounts = accounts.slice(skip);
            accounts = accounts.slice(0, take);
            let page = new pip_services3_commons_nodex_1.DataPage(accounts, total);
            return page;
        });
    }
    getProcessById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id == null)
                throw new pip_services3_commons_nodex_1.BadRequestException("Process id cannot be null");
            return yield this.getOneById(correlationId, id);
        });
    }
    startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false);
            if (process == null) {
                // Starting a new process
                process = ProcessStatesManager_1.ProcessStatesManager.startProcess(processType, processKey, timeToLive);
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
                // Assign initiator id for processs created without key
                process.request_id = processKey == null ? message.correlation_id : null;
                return yield this.create(correlationId, process);
            }
            else {
                var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
                if (checkRes)
                    throw checkRes;
                // If it's active throw exception
                if (process.status != ProcessStatusV1_1.ProcessStatusV1.Starting)
                    throw new ProcessAlreadyExistExceptionV1_1.ProcessAlreadyExistExceptionV1("Process with key " + processKey + " already exist");
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
                return yield this.update(correlationId, process);
            }
        });
    }
    activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false);
            if (process == null) {
                // Starting a new process
                let item = ProcessStatesManager_1.ProcessStatesManager.startProcess(processType, processKey, timeToLive);
                process = item;
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                // Assign initiator id for processs created without key
                process.request_id = processKey == null ? message.correlation_id : null;
                return yield this.create(correlationId, process);
            }
            else {
                let checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
                if (checkRes)
                    throw checkRes;
                checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
                if (checkRes)
                    throw checkRes;
                //ProcessStateHandler.CheckNotExpired(process);
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
                return yield this.update(correlationId, process);
            }
        });
    }
    activateProcess(correlationId, processId, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this.getOneById(correlationId, processId);
            let checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
            if (checkRes)
                throw checkRes;
            checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes)
                throw checkRes;
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
            return yield this.update(correlationId, process);
        });
    }
    activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcess(processType, processKey, null, true);
            let checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
            if (checkRes)
                throw checkRes;
            checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes)
                throw checkRes;
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
            process = yield this.update(correlationId, process);
            return process;
        });
    }
    rollbackProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            // For started process just remove them
            if (process.status == ProcessStatusV1_1.ProcessStatusV1.Starting) {
                yield this.deleteById(correlationId, process.id);
            }
            else {
                ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
                TasksManager_1.TasksManager.rollbackTasks(process);
                ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
                RecoveryManager_1.RecoveryManager.retryRecovery(process);
                // Copy process data
                process.data = state.data || process.data;
                yield this.update(correlationId, process);
            }
        });
    }
    continueProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    continueAndRecoverProcess(correlationId, state, recoveryQueueName, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    repeatProcessRecovery(correlationId, state, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, null, null, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    clearProcessRecovery(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcessByState(state);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            yield this.update(correlationId, process);
        });
    }
    failAndContinueProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueueName, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            //ProcessStatesManager.ActivateProcessWithFailure(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            ProcessStatesManager_1.ProcessStatesManager.requestProcessResponse(process, request);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueue, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    failProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcessByState(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.failProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    resumeProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcessByState(state);
            let checkRes = ProcessStatesManager_1.ProcessStatesManager.checkPending(process);
            if (checkRes)
                throw checkRes;
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            if (TasksManager_1.TasksManager.hasCompletedTasks(process))
                ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            else
                ProcessStatesManager_1.ProcessStatesManager.restartProcess(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, state.recovery_queue_name, state.recovery_message, 0);
            ProcessStatesManager_1.ProcessStatesManager.extendProcessExpiration(process);
            // Copy process data
            process.data = state.data || process.data;
            process.comment = comment;
            return yield this.update(correlationId, process);
        });
    }
    completeProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.completeProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            yield this.update(correlationId, process);
        });
    }
    abortProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcessByState(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            ProcessStatesManager_1.ProcessStatesManager.abortProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy over process data
            process.data = state.data || process.data;
            process.comment = comment;
            yield this.update(correlationId, process);
        });
    }
    updateProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(correlationId, state);
        });
    }
    deleteProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteById(correlationId, processId);
        });
    }
    requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getActiveProcess(state);
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.requestProcessResponse(process, request);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage);
            // Copy process data
            process.data = state.data || process.data;
            process = yield this.update(correlationId, process);
            return process;
        });
    }
    _getProcess(processType, processKey, initiatorId, errEnable = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (processType == null) {
                throw new pip_services3_commons_nodex_1.ApplicationException("Process type cannot be null");
            }
            if (processKey == null && initiatorId == null) {
                throw new pip_services3_commons_nodex_1.ApplicationException("Process key or initiator id must be present");
            }
            // Use either one to locate the right process
            if (processKey != null) {
                let item = yield this.getActiveByKey(" ", processType, processKey);
                if (item == null && errEnable)
                    throw new pip_services3_commons_nodex_1.ApplicationException("Process with key " + processKey + " was does not exist"); //ProcessNotFoundException
                return item;
            }
            else {
                let item = yield this.getActiveById(processType, initiatorId);
                if (item == null && errEnable)
                    throw new pip_services3_commons_nodex_1.ApplicationException("Process with key " + processKey + " was does not exist"); //ProcessNotFoundException
                return item;
            }
        });
    }
    getActiveByKey(correlationId, processType, processKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items.filter((x) => {
                return x.type == processType && x.key == processKey
                    && (x.status != ProcessStatusV1_1.ProcessStatusV1.Aborted && x.status != ProcessStatusV1_1.ProcessStatusV1.Completed);
            });
            let item = items.length > 0 ? items[0] : null;
            return item;
        });
    }
    getActiveById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items.filter((x) => {
                return x.id == id
                    && (x.status != ProcessStatusV1_1.ProcessStatusV1.Aborted && x.status != ProcessStatusV1_1.ProcessStatusV1.Completed);
            });
            let item = items.length > 0 ? items[0] : null;
            return item;
        });
    }
    _getProcessById(processId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (processId == null)
                throw new pip_services3_commons_nodex_1.BadRequestException("Process id cannot be null");
            let process = yield this.getActiveById("", processId);
            if (process == null)
                throw new ProcessNotFoundExceptionV1_1.ProcessNotFoundExceptionV1("Process with id " + processId + " was does not exist");
            return process;
        });
    }
    _getActiveProcess(state) {
        return __awaiter(this, void 0, void 0, function* () {
            let process = yield this._getProcessByState(state);
            var checkRes = ProcessLockManager_1.ProcessLockManager.checkLocked(state);
            if (checkRes)
                throw checkRes;
            // Relax rules for now - uncomment later
            //ProcessLockHandler.CheckLockValid(state);
            checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes)
                throw checkRes;
            checkRes = ProcessLockManager_1.ProcessLockManager.checkLocked(process);
            if (checkRes)
                throw checkRes;
            checkRes = ProcessLockManager_1.ProcessLockManager.checkLockMatches(state, process);
            if (checkRes)
                throw checkRes;
            return process;
        });
    }
    _getProcessByState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (state == null)
                throw new pip_services3_commons_nodex_1.BadRequestException("Process state cannot be null");
            return yield this._getProcessById(state.id);
        });
    }
    create(correlationId, process) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process == null)
                return;
            let exists = this._items.filter((x) => { return x.id == process.id; }).length > 0;
            if (exists)
                throw new ProcessAlreadyExistExceptionV1_1.ProcessAlreadyExistExceptionV1("Process with key " + process.key + " already exist");
            process = Object.assign({}, process);
            process.id = process.id || pip_services3_commons_nodex_1.IdGenerator.nextLong();
            this._items.push(process);
            return process;
        });
    }
    update(correlationId, process) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = this._items.map((x) => { return x.id; }).indexOf(process.id);
            if (index < 0)
                return;
            process = Object.assign({}, process);
            this._items[index] = process;
            return process;
        });
    }
    deleteById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = this._items.map((x) => { return x.id; }).indexOf(id);
            let item = this._items[index];
            if (index < 0)
                return;
            this._items.splice(index, 1);
            return item;
        });
    }
    getOneById(correlationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let processes = this._items.filter((x) => { return x.id == id; });
            let process = processes.length > 0 ? processes[0] : null;
            return process;
        });
    }
}
exports.ProcessStatesMockClientV1 = ProcessStatesMockClientV1;
//# sourceMappingURL=ProcessStatesMockClientV1.js.map