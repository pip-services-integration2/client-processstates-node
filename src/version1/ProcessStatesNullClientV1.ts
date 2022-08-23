

import { IProcessStatesClient } from "./IProcessStatesClient";
import { FilterParams, PagingParams, DataPage } from "pip-services3-commons-nodex";
import { MessageV1 } from "./MessageV1";
import { ProcessStateV1 } from "./ProcessStateV1";

export class ProcessStatesNullClientV1 implements IProcessStatesClient {
    public async getProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        return null;
    }
    public async startProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        return null;
    }
    public async activateOrStartProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        return null;
    }
    public async activateProcess(correlationId: string, processId: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        return null;
    }
    public async activateProcessByKey(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        return null;
    }
    public async rollbackProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return null;
    }
    public async continueProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return null;
    }
    public async continueAndRecoverProcess(correlationId: string, state: ProcessStateV1, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return null;
    }
    public async repeatProcessRecovery(correlationId: string, state: ProcessStateV1, recoveryTimeout: number): Promise<void> {
        return null;
    }
    public async clearProcessRecovery(correlationId: string, state: ProcessStateV1): Promise<void> {
        return null;
    }
    public async failAndContinueProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        return null;
    }
    public async failAndRecoverProcess(correlationId: string, state: ProcessStateV1, errorMessage: string, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return null;
    }
    public async suspendProcess(correlationId: string, state: ProcessStateV1, request: string, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return null;
    }
    public async failProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        return null;
    }
    public async resumeProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<ProcessStateV1> {
        return null;
    }
    public async completeProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return null;
    }
    public async abortProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<void> {
        return null;
    }
    public async updateProcess(correlationId: string, state: ProcessStateV1): Promise<ProcessStateV1> {
        return null;
    }
    public async deleteProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        return null;
    }
    public async requestProcessForResponse(correlationId: string, state: ProcessStateV1, request: string, recoveryQueueName: string, recoveryMessage: MessageV1): Promise<ProcessStateV1> {
        return null;
    }
    public async getProcesses(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<ProcessStateV1>> {
        return new DataPage<ProcessStateV1>()
    }
}