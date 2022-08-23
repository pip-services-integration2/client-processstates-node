

import { IProcessStatesClient } from "./IProcessStatesClient";
import { FilterParams, PagingParams, DataPage, Descriptor } from "pip-services3-commons-nodex";
import { MessageV1 } from "./MessageV1";
import { ProcessStateV1 } from "./ProcessStateV1";
import { DirectClient } from "pip-services3-rpc-nodex";

export class ProcessStatesDirectClientV1 extends DirectClient<any> implements IProcessStatesClient {

    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('service-processstates', 'controller', '*', '*', '1.0'));
    }

    public async getProcesses(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<ProcessStateV1>> {
        let timing = this.instrument(correlationId, 'processstates.get_processes');

        try {
            return await this._controller.getProcesses(correlationId, filter, paging);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async getProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.get_process_by_id');

        try {
            return await this._controller.getProcessById(correlationId, processId);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async startProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string,
        message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.start_process');

        try {
            return await this._controller.startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async activateOrStartProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string,
        message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.activate_or_start_process');
        
        try {
            return await this._controller.activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async activateProcess(correlationId: string, processId: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.activate_process');
        
        try {
            return await this._controller.activateProcess(correlationId, processId, taskType, queueName, message);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async activateProcessByKey(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.activate_process_by_key');
        
        try {
            return await this._controller.activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async rollbackProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.rollback_process');

        try {
            return await this._controller.rollbackProcess(correlationId, state);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async continueProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.continue_process');
        
        try {
            return await this._controller.continueProcess(correlationId, state);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async continueAndRecoverProcess(correlationId: string, state: ProcessStateV1, recoveryQueue: string, recoveryMessage: MessageV1,
        recoveryTimeout: number): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.continue_and_recover_process');
        
        try {
            return await this._controller.continueAndRecoverProcess(correlationId, state, recoveryQueue, recoveryMessage, recoveryTimeout);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async repeatProcessRecovery(correlationId: string, state: ProcessStateV1, recoveryTimeout: number): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.repeat_process_recovery');

        try {
            return await this._controller.repeatProcessRecovery(correlationId, state, recoveryTimeout);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async clearProcessRecovery(correlationId: string, state: ProcessStateV1): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.clear_process_recovery');

        try {
            return await this._controller.clearProcessRecovery(correlationId, state);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }   
    }

    public async failAndContinueProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.fail_and_continue_process');
        
        try {
            return await this._controller.failAndContinueProcess(correlationId, state, errorMessage);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async failAndRecoverProcess(correlationId: string, state: ProcessStateV1, errorMessage: string, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.fail_and_recover_process');

        try {
            return await this._controller.failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueue, recoveryMessage, recoveryTimeout);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async suspendProcess(correlationId: string, state: ProcessStateV1, request: string, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.suspend_process');

        try {
            return await this._controller.suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async failProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.fail_process');

        try {
            return await this._controller.failProcess(correlationId, state, errorMessage);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async resumeProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.resume_process');

        try {
            return await this._controller.resumeProcess(correlationId, state, comment);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async completeProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.complete_process');
        
        try {
            return await this._controller.completeProcess(correlationId, state);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async abortProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<void> {
        let timing = this.instrument(correlationId, 'processstates.abort_process');
        
        try {
            return await this._controller.abortProcess(correlationId, state, comment);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async updateProcess(correlationId: string, state: ProcessStateV1): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.update_process');
        
        try {
            return await this._controller.updateProcess(correlationId, state);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async deleteProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.delete_process_by_id');
        
        try {
            return await this._controller.deleteProcessById(correlationId, processId);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async requestProcessForResponse(correlationId: string, state: ProcessStateV1, request: string, recoveryQueueName: string, recoveryMessage: MessageV1): Promise<ProcessStateV1> {
        let timing = this.instrument(correlationId, 'processstates.request_process_for_response');

        try {
            return await this._controller.requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }
}