const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { IProcessStatesClient } from '../../src/version1/IProcessStatesClient';
import { IProcessStatesPersistence, MessageV1, ProcessStatusV1, ProcessStateV1, TaskStateV1, TaskStatusV1 } from 'service-processstates-node';


let MESSAGE1: MessageV1 = {
    correlation_id: "test_processes1",
    message_id: "msg_1",
    message_type: "Order.Msg",
    sent_time: new Date(Date.now() - 2 * 3600),
    message: "Sync orders"
}

let MESSAGE2: MessageV1 = {
    correlation_id: "test_processes2",
    message_id: "msg_2",
    message_type: "Order.Msg",
    sent_time: new Date(Date.now() - 3600),
    message: "Copy orders"
}

let MESSAGE3: MessageV1 = {
    correlation_id: "test_processes3",
    message_id: "msg_3",
    message_type: "Order.Msg",
    sent_time: new Date(),
    message: "Sync orders"
}


export class ProcessStatesClientV1Fixture {
    private _client: IProcessStatesClient;
    private _persistence: IProcessStatesPersistence

    constructor(client: IProcessStatesClient, persistence: IProcessStatesPersistence) {
        assert.isNotNull(client);
        assert.isNotNull(persistence);
        this._client = client;
        this._persistence = persistence;
    }

    public async testCrudOperations() {

        let process1, process2: ProcessStateV1;

        // Create process one
        let process = await this._client.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE1, 5 * 3600);

        assert.equal(process.request_id, MESSAGE1.correlation_id);
        assert.equal(process.type, "Process.Type1");
        assert.equal(process.status, ProcessStatusV1.Starting);
        assert.isNotNull(process.start_time);
        assert.isNotNull(process.last_action_time);
        assert.isNotNull(process.expiration_time);
        assert.isNotNull(process.tasks);
        assert.equal(process.tasks.length, 1);
        assert.isNotNull(process.data);
        process1 = process;

        // Create process two
        process = await this._client.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE2, 2 * 3600);

        assert.equal(process.request_id, MESSAGE2.correlation_id);
        assert.equal(process.type, "Process.Type1");
        assert.equal(process.status, ProcessStatusV1.Starting);
        assert.isNotNull(process.start_time);
        assert.isNotNull(process.last_action_time);
        assert.isNotNull(process.expiration_time);
        assert.isNotNull(process.tasks);
        assert.equal(process.tasks.length, 1);
        assert.isNotNull(process.data);
        process2 = process;

        // Create process three
        process = await this._client.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE3, 3 * 3600);

        assert.equal(process.request_id, MESSAGE3.correlation_id);
        assert.equal(process.type, "Process.Type1");
        assert.equal(process.status, ProcessStatusV1.Starting);
        assert.isNotNull(process.start_time);
        assert.isNotNull(process.last_action_time);
        assert.isNotNull(process.expiration_time);
        assert.isNotNull(process.tasks);
        assert.equal(process.tasks.length, 1);
        assert.isNotNull(process.data);

        // Get all processes
        let page = await this._client.getProcesses(null, new FilterParams(), new PagingParams);

        assert.isNotNull(page);
        assert.isObject(page);
        assert.equal(page.data.length, 3);

        // Update process
        process1.comment = "Update comment";
        process = await this._client.updateProcess(null, process1);

        assert.equal(process.comment, "Update comment");
        assert.equal(process.id, process1.id);

        // Get process
        process = await this._client.getProcessById(null, process1.id);

        assert.equal(process.id, process1.id);

        // Delete process
        process = await this._client.deleteProcessById(null, process2.id);

        assert.equal(process2.id, process.id);

        // Get all processes
        page = await this._client.getProcesses(null, new FilterParams(), new PagingParams);

        assert.isNotNull(page);
        assert.isObject(page);
        assert.equal(page.data.length, 2);

        // Try get deleted processes
        process = await this._client.getProcessById(null, process2.id);

        assert.isNull(process);
    }

    public async testGetProcessbynullId() {
        let err = null;
        try {
            await this._client.getProcessById(null, null);
        } catch(ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }

    public async testContinueProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        await this._persistence.create(null, process);
        await this._client.continueProcess(null, process);
    }

    public async testTryContinueProcessWithnotExistId() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id_not_exists";
        let err = null;

        try {
            await this._client.continueProcess(null, process);
        } catch(ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }

    public async testTryContinueProcessWithNullId() {
        let process: ProcessStateV1 = new ProcessStateV1();

        let err = null;

        try {
            await this._client.continueProcess(null, process);
        } catch (ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }

    public async testAbortProces() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let comment = "comment";

        process = await this._persistence.create(null, process);

        await this._client.abortProcess(null, process, comment);

        let processResult = await this._persistence.getOneById(null, process.id);

        assert.equal(process.id, processResult.id);
        assert.equal(ProcessStatusV1.Aborted, processResult.status);
        assert.equal(comment, processResult.comment);
    }


    public async testContinuieWithRecoveryProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        process = await this._persistence.create(null, process);
        await this._client.continueAndRecoverProcess(null, process, "queue name", messageEnvelop, 0);

        let processResult = await this._persistence.getOneById(null, process.id);

        assert.equal(ProcessStatusV1.Running, processResult.status);
        assert.equal(process.id, processResult.id);
        assert.equal(messageEnvelop.correlation_id, processResult.recovery_message.correlation_id);
        assert.equal(messageEnvelop.message_type, processResult.recovery_message.message_type);
        assert.equal("queue name", processResult.recovery_queue_name);
    }

    public async testCompleteProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        process = await this._persistence.create(null, process);
        await this._client.completeProcess(null, process);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.equal(process.id, processResult.id);
        assert.equal(ProcessStatusV1.Completed, processResult.status);
    }

    public async testRequestForResponseProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        process = await this._persistence.create(null, process);

        let processResult = await this._client.requestProcessForResponse(null, process, "request", "queue", new MessageV1());
        assert.equal(process.id, processResult.id);
        assert.equal("queue", processResult.recovery_queue_name);
        assert.equal("request", processResult.request);
        assert.equal(ProcessStatusV1.Suspended, processResult.status);
    }

    public async testRollbackProcessWithStatusRunning() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        process = await this._persistence.create(null, process);
        await this._client.rollbackProcess(null, process);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.equal(process.id, processResult.id);
        assert.equal(ProcessStatusV1.Running, processResult.status);
    }

    public async testRollbackProcessWithStateStarting() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        process = await this._persistence.create(null, process);
        await this._client.rollbackProcess(null, process);

        let processResult = await this._persistence.getOneById(null, process.id);

        assert.isNull(processResult);
    }


    public async testFailProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let comment = "comment";

        process = await this._persistence.create(null, process);
        await this._client.failProcess(null, process, comment);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.equal(ProcessStatusV1.Failed, processResult.status);
    }

    public async testFailWithRecoveryProcess() {

        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        process = await this._persistence.create(null, process);
        await this._client.failAndRecoverProcess(null, process, error, "queue name", messageEnvelop, 0);

        let processResult = await this._persistence.getOneById(null, process.id);

        assert.equal(process.id, processResult.id);
        assert.equal(messageEnvelop.correlation_id, processResult.recovery_message.correlation_id);
        assert.equal(messageEnvelop.message_type, processResult.recovery_message.message_type);
        assert.equal("queue name", processResult.recovery_queue_name);
    }


    public async testContinueForFailProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        process = await this._persistence.create(null, process);

        process.recovery_message = messageEnvelop;
        await this._client.failAndContinueProcess(null, process, error);

        let processResult = await this._persistence.getOneById(null, process.id);

        assert.equal(process.id, processResult.id);
        assert.equal(ProcessStatusV1.Running, processResult.status);
        assert.isNull(processResult.recovery_message);
        assert.isNull(processResult.recovery_queue_name);
    }


    public async testRepeatRecoveryProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        process = await this._persistence.create(null, process);
        await this._client.repeatProcessRecovery(null, process, 0);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.equal(1, processResult.recovery_attempts);
    }


    public async testReturnErrorIfProcessStateDontEqualStarting() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.key = "key";
        process.type = "type";

        process = await this._persistence.create(null, process);

        let err = null;
        
        try {
            await this._client.startProcess(null, "type", "key", "type", null, null, null);
        } catch(ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }


    public async testStart() {
        let processResult = await this._client.startProcess(null, "type", "key", "type", null, null, 0);
        assert.equal(ProcessStatusV1.Starting, processResult.status);
    }

    public async testStartOrActivateProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        process = await this._persistence.create(null, process);
        let processResult = await this._client.activateOrStartProcess(null, "type", "key", "type", null, null, 0);

        assert.equal(ProcessStatusV1.Starting, processResult.status);
    }


    public async testReturnErrorIfResumeStartedWithoutProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        let err = null;

        try {
            await this._client.resumeProcess(null, process, "comment");
        } catch(ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }

    public async testReturnErrorIfResumeStartedWithoutProcessId() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        let err = null;

        try {
            await this._client.resumeProcess(null, process, "comment");
        } catch (ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }


    public async testReturnErrorIfProcessTypeNull() {
        let err = null;

        try {
            await this._client.activateOrStartProcess(null, null, "key", "type", null, null, 0);
        } catch (ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }

    //TODO: Need check this test!
    public async testReturnErrorIfProcessKeyNull() {
        let err = null;

        try {
            await this._client.activateOrStartProcess(null, "type", null, "type", null, new MessageV1(), 0);
        } catch (ex) {
            err = ex;
        }

        assert.isNotNull(err);
    }


    public async testResumeWithoutCompletedTasksProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Suspended;
        process.tasks = new Array<TaskStateV1>();

        process = await this._persistence.create(null, process);

        let processResult = await this._client.resumeProcess(null, process, "comment");
        assert.equal(ProcessStatusV1.Starting, processResult.status);
        assert.equal("comment", processResult.comment);
    }


    public async testResumeWithCompletedTasksProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Suspended;
        process.tasks = new Array<TaskStateV1>();
        let task: TaskStateV1 = new TaskStateV1();
        task.type = "task.type";
        task.status = TaskStatusV1.Completed;
        task.queue_name = "activity queue name";
        process.tasks.push(task);

        await this._persistence.create(null, process);

        let processResult = await this._client.resumeProcess(null, process, "comment");

        assert.equal(ProcessStatusV1.Running, processResult.status);
        assert.equal("comment", processResult.comment);
    }


    public async testClearRecoveryMessageInProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        process = await this._persistence.create(null, process);
        await this._client.clearProcessRecovery(null, process);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.equal(process.id, processResult.id);
        assert.isNull(processResult.recovery_queue_name);
        assert.isNull(processResult.recovery_time);
        assert.isNull(processResult.recovery_message);
    }

    public async testUpdateProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        await this._persistence.create(null, process);

        process.recovery_queue_name = "updated queue";
        let resultProcess = await this._client.updateProcess(null, process);

        assert.isNotNull(resultProcess);
        assert.equal(resultProcess.id, process.id);
        assert.equal(resultProcess.recovery_queue_name, process.recovery_queue_name);
    }

    public async testDeleteProcess() {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        await this._persistence.create(null, process);
        await this._client.deleteProcessById(null, process.id);

        let processResult = await this._persistence.getOneById(null, process.id);
        assert.isNull(processResult);
    }
}
