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
exports.ProcessStatesDirectClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class ProcessStatesDirectClientV1 extends pip_services3_rpc_nodex_1.DirectClient {
    constructor() {
        super();
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-processstates', 'controller', '*', '*', '1.0'));
    }
    getProcesses(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.get_processes');
            try {
                return yield this._controller.getProcesses(correlationId, filter, paging);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.get_process_by_id');
            try {
                return yield this._controller.getProcessById(correlationId, processId);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.start_process');
            try {
                return yield this._controller.startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.activate_or_start_process');
            try {
                return yield this._controller.activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    activateProcess(correlationId, processId, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.activate_process');
            try {
                return yield this._controller.activateProcess(correlationId, processId, taskType, queueName, message);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.activate_process_by_key');
            try {
                return yield this._controller.activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    rollbackProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.rollback_process');
            try {
                return yield this._controller.rollbackProcess(correlationId, state);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    continueProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.continue_process');
            try {
                return yield this._controller.continueProcess(correlationId, state);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    continueAndRecoverProcess(correlationId, state, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.continue_and_recover_process');
            try {
                return yield this._controller.continueAndRecoverProcess(correlationId, state, recoveryQueue, recoveryMessage, recoveryTimeout);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    repeatProcessRecovery(correlationId, state, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.repeat_process_recovery');
            try {
                return yield this._controller.repeatProcessRecovery(correlationId, state, recoveryTimeout);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    clearProcessRecovery(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.clear_process_recovery');
            try {
                return yield this._controller.clearProcessRecovery(correlationId, state);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    failAndContinueProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.fail_and_continue_process');
            try {
                return yield this._controller.failAndContinueProcess(correlationId, state, errorMessage);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.fail_and_recover_process');
            try {
                return yield this._controller.failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueue, recoveryMessage, recoveryTimeout);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.suspend_process');
            try {
                return yield this._controller.suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    failProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.fail_process');
            try {
                return yield this._controller.failProcess(correlationId, state, errorMessage);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    resumeProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.resume_process');
            try {
                return yield this._controller.resumeProcess(correlationId, state, comment);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    completeProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.complete_process');
            try {
                return yield this._controller.completeProcess(correlationId, state);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    abortProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.abort_process');
            try {
                return yield this._controller.abortProcess(correlationId, state, comment);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    updateProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.update_process');
            try {
                return yield this._controller.updateProcess(correlationId, state);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.delete_process_by_id');
            try {
                return yield this._controller.deleteProcessById(correlationId, processId);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'processstates.request_process_for_response');
            try {
                return yield this._controller.requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
}
exports.ProcessStatesDirectClientV1 = ProcessStatesDirectClientV1;
//# sourceMappingURL=ProcessStatesDirectClientV1.js.map