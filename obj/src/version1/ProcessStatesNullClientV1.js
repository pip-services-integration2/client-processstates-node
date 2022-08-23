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
exports.ProcessStatesNullClientV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
class ProcessStatesNullClientV1 {
    getProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    activateProcess(correlationId, processId, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    rollbackProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    continueProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    continueAndRecoverProcess(correlationId, state, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    repeatProcessRecovery(correlationId, state, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    clearProcessRecovery(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    failAndContinueProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    failProcess(correlationId, state, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    resumeProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    completeProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    abortProcess(correlationId, state, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    updateProcess(correlationId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    deleteProcessById(correlationId, processId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getProcesses(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return new pip_services3_commons_nodex_1.DataPage();
        });
    }
}
exports.ProcessStatesNullClientV1 = ProcessStatesNullClientV1;
//# sourceMappingURL=ProcessStatesNullClientV1.js.map