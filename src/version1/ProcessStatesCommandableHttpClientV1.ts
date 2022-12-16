import { CommandableHttpClient } from "pip-services3-rpc-nodex";
import { IProcessStatesClient } from "./IProcessStatesClient";
import { FilterParams, PagingParams, DataPage } from "pip-services3-commons-nodex";
import { MessageV1 } from "./MessageV1";
import { ProcessStateV1 } from "./ProcessStateV1";

export class ProcessStatesCommandableHttpClientV1 extends CommandableHttpClient implements IProcessStatesClient {

    public constructor() {
        super('v1/process_states');
    }

    public async getProcesses(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<ProcessStateV1>> {
        return await this.callCommand(
            'get_processes',
            correlationId,
            {
                filter: filter,
                paging: paging
            }
        );
    }

    public async getProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        return await this.callCommand(
            'get_process_by_id',
            correlationId,
            {
                process_id: processId
            }
        );
    }

    public async startProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        return await this.callCommand(
            'start_process',
            correlationId,
            {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message,
                ttl: timeToLive
            }
        );
    }

    public async activateOrStartProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        return await this.callCommand(
            'activate_or_start_process',
            correlationId,
            {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message,
                ttl: timeToLive
            }
        );
    }

    public async activateProcess(correlationId: string, processId: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        return await this.callCommand(
            'activate_process',
            correlationId,
            {
                process_id: processId,
                task_type: taskType,
                queue_name: queueName,
                message: message
            }
        );
    }

    public async activateProcessByKey(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        return await this.callCommand(
            'activate_process_by_key',
            correlationId,
            {
                process_type: processType,
                process_key: processKey,
                task_type: taskType,
                queue_name: queueName,
                message: message
            }
        );
    }

    public async rollbackProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return await this.callCommand(
            'rollback_process',
            correlationId,
            {
                state: state
            }
        );
    }

    public async continueProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return await this.callCommand(
            'continue_process',
            correlationId,
            {
                state: state
            }
        );
    }

    public async continueAndRecoverProcess(correlationId: string, state: ProcessStateV1, recoveryQueue: string,
        recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return await this.callCommand(
            'continue_and_recovery_process',
            correlationId,
            {
                state: state,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            }
        );
    }

    public async repeatProcessRecovery(correlationId: string, state: ProcessStateV1, recoveryTimeout: number): Promise<void> {
        return await this.callCommand(
            'repeat_process_recovery',
            correlationId,
            {
                state: state,
                timeout: recoveryTimeout
            }
        );
    }

    public async clearProcessRecovery(correlationId: string, state: ProcessStateV1): Promise<void> {
        return await this.callCommand(
            'clear_process_recovery',
            correlationId,
            {
                state: state
            }
        );
    }

    public async failAndContinueProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        return await this.callCommand(
            'fail_and_continue_process',
            correlationId,
            {
                state: state,
                err_msg: errorMessage
            }
        );
    }

    public async failAndRecoverProcess(correlationId: string, state: ProcessStateV1, errorMessage: string,
        recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return await this.callCommand(
            'fail_and_recover_process',
            correlationId,
            {
                state: state,
                err_msg: errorMessage,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            }
        );
    }

    public async suspendProcess(correlationId: string, state: ProcessStateV1, request: string, recoveryQueue: string,
        recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        return await this.callCommand(
            'suspend_process',
            correlationId,
            {
                state: state,
                request: request,
                queue_name: recoveryQueue,
                message: recoveryMessage,
                timeout: recoveryTimeout
            }
        );
    }

    public async failProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        return await this.callCommand(
            'fail_process',
            correlationId,
            {
                state: state,
                err_msg: errorMessage
            }
        );
    }

    public async resumeProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<ProcessStateV1> {
        return await this.callCommand(
            'resume_process',
            correlationId,
            {
                state: state,
                comment: comment
            }
        );
    }

    public async completeProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        return await this.callCommand(
            'complete_process',
            correlationId,
            {
                state: state
            }
        );
    }

    public async abortProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<void> {
        return await this.callCommand(
            'abort_process',
            correlationId,
            {
                state: state,
                comment: comment
            }
        );
    }

    public async updateProcess(correlationId: string, state: ProcessStateV1): Promise<ProcessStateV1> {
        return await this.callCommand(
            'update_process',
            correlationId,
            {
                state: state
            }
        );
    }

    public async deleteProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        return await this.callCommand(
            'delete_process_by_id',
            correlationId,
            {
                process_id: processId
            }
        );
    }

    public async requestProcessForResponse(correlationId: string, state: ProcessStateV1, request: string,
        recoveryQueueName: string, recoveryMessage: MessageV1): Promise<ProcessStateV1> {
        return await this.callCommand(
            'request_process_for_response',
            correlationId,
            {
                state: state,
                request: request,
                queue_name: recoveryQueueName,
                message: recoveryMessage
            }
        );
    }
}