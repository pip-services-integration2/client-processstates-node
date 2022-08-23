
import { ApplicationException, BadRequestException, DataPage, FilterParams, IdGenerator, PagingParams } from "pip-services3-commons-nodex";
import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';
import { IProcessStatesClient } from "./IProcessStatesClient";
import { MessageV1 } from "./MessageV1";
import { ProcessStateV1 } from "./ProcessStateV1";
import { ProcessStatusV1 } from "./ProcessStatusV1";
import { ProcessStatesManager } from "./ProcessStatesManager";
import { ProcessLockManager } from "./ProcessLockManager";
import { TasksManager } from "./TasksManager";
import { ProcessAlreadyExistExceptionV1 } from "./ProcessAlreadyExistExceptionV1";
import { ProcessNotFoundExceptionV1 } from "./ProcessNotFoundExceptionV1";
import { RecoveryManager } from "./RecoveryManager";

export class ProcessStatesMemoryClientV1 implements IProcessStatesClient {
    private _maxPageSize: number = 100;
    private _items: ProcessStateV1[] = [];

    private toStringArray(value: string): string[] {
        if (value == null) return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }

    private matchSearch(status: ProcessStateV1, search: string): boolean {
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

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

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

        return (item: ProcessStateV1) => {
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

    public async getProcesses(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<ProcessStateV1>> {
        let filterCurl = this.composeFilter(filter);
        let accounts = this._items.filter(filterCurl);

        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total)
            total = accounts.length;

        if (skip > 0)
            accounts = accounts.slice(skip);
        accounts = accounts.slice(0, take);

        let page = new DataPage<ProcessStateV1>(accounts, total);
        return page;
    }

    public async getProcessById(correlationId: string, id: string): Promise<ProcessStateV1> {
        if (id == null)
            throw new BadRequestException("Process id cannot be null");
            
        return await this.getOneById(correlationId, id);
    }

    public async startProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        let process = await this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false);

        if (process == null) {
            // Starting a new process
            process = ProcessStatesManager.startProcess(processType, processKey, timeToLive);
            ProcessLockManager.lockProcess(process, taskType);
            TasksManager.startTasks(process, taskType, queueName, message);

            // Assign initiator id for processs created without key
            process.request_id = processKey == null ? message.correlation_id : null;
            return await this.create(correlationId, process);
        }
        else {
            var checkRes = ProcessLockManager.checkNotLocked(process);

            if (checkRes)
                throw checkRes;

            // If it's active throw exception
            if (process.status != ProcessStatusV1.Starting)
                throw new ProcessAlreadyExistExceptionV1("Process with key " + processKey + " already exist");

            ProcessLockManager.lockProcess(process, taskType);
            TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager.startTasks(process, taskType, queueName, message);
            return await this.update(correlationId, process);
        }
    }

    public async activateOrStartProcess(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1, timeToLive: number): Promise<ProcessStateV1> {
        let process = await this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false);

        if (process == null) {
            // Starting a new process
            let item = ProcessStatesManager.startProcess(processType, processKey, timeToLive);
            process = item;
            TasksManager.startTasks(process, taskType, queueName, message);
            ProcessLockManager.lockProcess(process, taskType);
            // Assign initiator id for processs created without key
            process.request_id = processKey == null ? message.correlation_id : null;
            return await this.create(correlationId, process);
        } else {
            let checkRes = ProcessLockManager.checkNotLocked(process);
            if (checkRes)
                throw checkRes;

            checkRes = ProcessStatesManager.checkActive(process);
            if (checkRes)
                throw checkRes;

            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager.lockProcess(process, taskType);
            TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager.startTasks(process, taskType, queueName, message);
            return await this.update(correlationId, process);
        }
    }

    public async activateProcess(correlationId: string, processId: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        let process = await this.getOneById(correlationId, processId);

        let checkRes = ProcessLockManager.checkNotLocked(process);
        if (checkRes)
            throw checkRes;

        checkRes = ProcessStatesManager.checkActive(process);
        if (checkRes)
            throw checkRes

        //ProcessStateHandler.CheckNotExpired(process);
        ProcessLockManager.lockProcess(process, taskType);
        TasksManager.failTasks(process, "Lock timeout expired");
        TasksManager.startTasks(process, taskType, queueName, message);

        return await this.update(correlationId, process);
    }

    public async activateProcessByKey(correlationId: string, processType: string, processKey: string, taskType: string, queueName: string, message: MessageV1): Promise<ProcessStateV1> {
        let process = await this._getProcess(processType, processKey, null, true);

        let checkRes = ProcessLockManager.checkNotLocked(process);
        if (checkRes)
            throw checkRes;

        checkRes = ProcessStatesManager.checkActive(process);
        if (checkRes)
            throw checkRes;

        //ProcessStateHandler.CheckNotExpired(process);
        ProcessLockManager.lockProcess(process, taskType);
        TasksManager.failTasks(process, "Lock timeout expired");
        TasksManager.startTasks(process, taskType, queueName, message);

        process = await this.update(correlationId, process);
        return process;
    }

    public async rollbackProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let process = await this._getActiveProcess(state);

        // For started process just remove them
        if (process.status == ProcessStatusV1.Starting) {
            await this.deleteById(correlationId, process.id);
        } else {
            ProcessLockManager.unlockProcess(process);
            TasksManager.rollbackTasks(process);
            ProcessStatesManager.repeatProcessActivation(process);
            RecoveryManager.retryRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            await this.update(correlationId, process);
        }
    }

    public async continueProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.completeTasks(process);
        ProcessStatesManager.continueProcess(process);
        RecoveryManager.clearRecovery(process);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async continueAndRecoverProcess(correlationId: string, state: ProcessStateV1, recoveryQueueName: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.completeTasks(process);
        ProcessStatesManager.continueProcess(process);
        RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async repeatProcessRecovery(correlationId: string, state: ProcessStateV1, recoveryTimeout: number): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.completeTasks(process);
        ProcessStatesManager.repeatProcessActivation(process);
        RecoveryManager.setRecovery(process, null, null, recoveryTimeout);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async clearProcessRecovery(correlationId: string, state: ProcessStateV1): Promise<void> {
        let process = await this._getProcessByState(state);

        RecoveryManager.clearRecovery(process);
        await this.update(correlationId, process);
    }

    public async failAndContinueProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.failTasks(process, errorMessage);
        ProcessStatesManager.repeatProcessActivation(process);
        RecoveryManager.clearRecovery(process);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async failAndRecoverProcess(correlationId: string, state: ProcessStateV1, errorMessage: string, recoveryQueueName: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.failTasks(process, errorMessage);
        ProcessStatesManager.repeatProcessActivation(process);
        //ProcessStatesManager.ActivateProcessWithFailure(process);
        RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);

        // Copy process data
        process.data = state.data || process.data;

        await this.update(correlationId, process);
    }

    public async suspendProcess(correlationId: string, state: ProcessStateV1, request: string, recoveryQueue: string, recoveryMessage: MessageV1, recoveryTimeout: number): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        ProcessStatesManager.requestProcessResponse(process, request);
        RecoveryManager.setRecovery(process, recoveryQueue, recoveryMessage, recoveryTimeout);

        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async failProcess(correlationId: string, state: ProcessStateV1, errorMessage: string): Promise<void> {
        let process = await this._getProcessByState(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.failTasks(process, errorMessage);
        ProcessStatesManager.failProcess(process);
        RecoveryManager.clearRecovery(process);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async resumeProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<ProcessStateV1> {
        let process = await this._getProcessByState(state);

        let checkRes = ProcessStatesManager.checkPending(process);
        if (checkRes)
            throw checkRes;

        ProcessLockManager.unlockProcess(process);
        if (TasksManager.hasCompletedTasks(process))
            ProcessStatesManager.continueProcess(process);
        else
            ProcessStatesManager.restartProcess(process);
        RecoveryManager.setRecovery(process, state.recovery_queue_name, state.recovery_message, 0);
        ProcessStatesManager.extendProcessExpiration(process);
        // Copy process data
        process.data = state.data || process.data;
        process.comment = comment;
        return await this.update(correlationId, process);
    }

    public async completeProcess(correlationId: string, state: ProcessStateV1): Promise<void> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.completeTasks(process);
        ProcessStatesManager.completeProcess(process);
        RecoveryManager.clearRecovery(process);
        // Copy process data
        process.data = state.data || process.data;
        await this.update(correlationId, process);
    }

    public async abortProcess(correlationId: string, state: ProcessStateV1, comment: string): Promise<void> {
        let process = await this._getProcessByState(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.failTasks(process, "Lock timeout expired");
        ProcessStatesManager.abortProcess(process);
        RecoveryManager.clearRecovery(process);
        // Copy over process data
        process.data = state.data || process.data;
        process.comment = comment;
        await this.update(correlationId, process);
    }

    public async updateProcess(correlationId: string, state: ProcessStateV1): Promise<ProcessStateV1> {
        return await this.update(correlationId, state);
    }

    public async deleteProcessById(correlationId: string, processId: string): Promise<ProcessStateV1> {
        return await this.deleteById(correlationId, processId);
    }

    public async requestProcessForResponse(correlationId: string, state: ProcessStateV1, request: string, recoveryQueueName: string, recoveryMessage: MessageV1): Promise<ProcessStateV1> {
        let process = await this._getActiveProcess(state);

        ProcessLockManager.unlockProcess(process);
        TasksManager.completeTasks(process);
        ProcessStatesManager.requestProcessResponse(process, request);
        RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage);
        // Copy process data
        process.data = state.data || process.data;
        process = await this.update(correlationId, process);
        return process;
    }

    private async _getProcess(
        processType: string, processKey: string, initiatorId: string, errEnable: boolean = true): Promise<ProcessStateV1> {
        if (processType == null) {
            throw new ApplicationException("Process type cannot be null")
        }
        if (processKey == null && initiatorId == null) {
            throw new ApplicationException("Process key or initiator id must be present")
        }

        // Use either one to locate the right process
        if (processKey != null) {
            let item = await this.getActiveByKey(" ", processType, processKey);
            if (item == null && errEnable)
                throw new ApplicationException("Process with key " + processKey + " was does not exist"); //ProcessNotFoundException

            return item;
        } else {
            let item = await this.getActiveById(processType, initiatorId);
            if (item == null && errEnable)
                throw new ApplicationException("Process with key " + processKey + " was does not exist"); //ProcessNotFoundException

            return item;
        }
    }

    private async getActiveByKey(correlationId: string, processType: string, processKey: string): Promise<ProcessStateV1> {
        let items = this._items.filter((x) => {
            return x.type == processType && x.key == processKey
                && (x.status != ProcessStatusV1.Aborted && x.status != ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;

        return item;
    }

    private async getActiveById(correlationId: string, id: string): Promise<ProcessStateV1> {
        let items = this._items.filter((x) => {
            return x.id == id
                && (x.status != ProcessStatusV1.Aborted && x.status != ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;

        return item;
    }

    private async _getProcessById(processId: string): Promise<ProcessStateV1> {
        if (processId == null)
            throw new BadRequestException("Process id cannot be null");


        let process = await this.getActiveById("", processId);

        if (process == null)
            throw new ProcessNotFoundExceptionV1("Process with id " + processId + " was does not exist");

        return process;
    }

    private async _getActiveProcess(state: ProcessStateV1): Promise<ProcessStateV1> {
        let process = await this._getProcessByState(state);
        var checkRes = ProcessLockManager.checkLocked(state);
        if (checkRes)
            throw checkRes;

        // Relax rules for now - uncomment later
        //ProcessLockHandler.CheckLockValid(state);
        checkRes = ProcessStatesManager.checkActive(process);
        if (checkRes)
            throw checkRes;

        checkRes = ProcessLockManager.checkLocked(process);
        if (checkRes)
            throw checkRes;

        checkRes = ProcessLockManager.checkLockMatches(state, process);
        if (checkRes)
            throw checkRes;

        return process;
    }

    private async _getProcessByState(state: ProcessStateV1): Promise<ProcessStateV1> {
        if (state == null)
            throw new BadRequestException("Process state cannot be null");

        return await this._getProcessById(state.id);
    }

    public async create(correlationId: string, process: ProcessStateV1): Promise<ProcessStateV1> {
        if (process == null) return;

        let exists = this._items.filter((x) => { return x.id == process.id; }).length > 0;
        if (exists)
            throw new ProcessAlreadyExistExceptionV1("Process with key " + process.key + " already exist");


        process = Object.assign({}, process);
        process.id = process.id || IdGenerator.nextLong();

        this._items.push(process);

        return process;
    }

    protected async update(correlationId: string, process: ProcessStateV1): Promise<ProcessStateV1> {
        let index = this._items.map((x) => { return x.id; }).indexOf(process.id);

        if (index < 0) return;

        process = Object.assign({}, process);
        this._items[index] = process;

        return process;
    }

    protected async deleteById(correlationId: string, id: string): Promise<ProcessStateV1> {
        let index = this._items.map((x) => { return x.id; }).indexOf(id);
        let item = this._items[index];

        if (index < 0) return;

        this._items.splice(index, 1);

        return item;
    }

    public async getOneById(correlationId: string, id: string): Promise<ProcessStateV1> {
        let processes = this._items.filter((x) => { return x.id == id; });
        let process = processes.length > 0 ? processes[0] : null;

        return process;
    }
}