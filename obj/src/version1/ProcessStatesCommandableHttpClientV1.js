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
exports.ProcessStatesCommandableHttpClientV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class ProcessStatesCommandableHttpClientV1 extends pip_services3_rpc_nodex_1.CommandableHttpClient {
    constructor() {
        super('v1/process_states');
    }
    getProcesses(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_processes', correlationId, {
                filter: filter,
                paging: paging
            });
        });
    }
    getProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('get_process_by_id', correlationId, {
                process_id: processId
            });
        });
    }
    startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('start_process', correlationId, {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message,
                ttl: timeToLive
            });
        });
    }
    activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('activate_or_start_process', correlationId, {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message,
                ttl: timeToLive
            });
        });
    }
    activateProcess(correlationId, processId, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('activate_process', correlationId, {
                process_id: processId,
                task_type: taskType,
                queue_name: queueName,
                message: message
            });
        });
    }
    activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('activate_process_by_key', correlationId, {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message
            });
        });
    }
    rollbackProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('rollback_process', correlationId, {
                state: state
            });
        });
    }
    continueProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('continue_process', correlationId, {
                state: state
            });
        });
    }
    continueAndRecoverProcess(correlationId, state, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('continue_and_recovery_process', correlationId, {
                state: state,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            });
        });
    }
    repeatProcessRecovery(correlationId, state, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('repeat_process_recovery', correlationId, {
                state: state,
                timeout: recoveryTimeout
            });
        });
    }
    clearProcessRecovery(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('clear_process_recovery', correlationId, {
                state: state
            });
        });
    }
    failAndContinueProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('fail_and_continue_process', correlationId, {
                state: state,
                err_msg: errorMessage
            });
        });
    }
    failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('fail_and_recover_process', correlationId, {
                state: state,
                err_msg: errorMessage,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            });
        });
    }
    suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('suspend_process', correlationId, {
                state: state,
                request: request,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            });
        });
    }
    failProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('fail_process', correlationId, {
                state: state,
                err_msg: errorMessage
            });
        });
    }
    resumeProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('resume_process', correlationId, {
                state: state,
                comment: comment
            });
        });
    }
    completeProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('complete_process', correlationId, {
                state: state
            });
        });
    }
    abortProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('abort_process', correlationId, {
                state: state,
                comment: comment
            });
        });
    }
    updateProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('update_process', correlationId, {
                state: state
            });
        });
    }
    deleteProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('delete_process_by_id', correlationId, {
                process_id: processId
            });
        });
    }
    requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callCommand('request_process_for_response', correlationId, {
                state: state,
                request: request,
                queue_name: recoveryQueueName,
                message: recoveryMessage
            });
        });
    }
}
exports.ProcessStatesCommandableHttpClientV1 = ProcessStatesCommandableHttpClientV1;
//# sourceMappingURL=ProcessStatesCommandableHttpClientV1.js.map