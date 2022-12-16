import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { ProcessStatesMemoryPersistence } from 'service-processstates-node';
import { ProcessStatesController } from 'service-processstates-node';
import { ProcessStatesCommandableHttpServiceV1 } from 'service-processstates-node';

import { ProcessStatesCommandableHttpClientV1 } from '../../src/version1/ProcessStatesCommandableHttpClientV1';
import { ProcessStatesClientV1Fixture } from './ProcessStatesClientV1Fixture';

suite('ProcessStatesCommandableHttpClientV1', async () => {2
    let persistence: ProcessStatesMemoryPersistence;
    let controller: ProcessStatesController;
    let service: ProcessStatesCommandableHttpServiceV1;
    let client: ProcessStatesCommandableHttpClientV1;
    let fixture: ProcessStatesClientV1Fixture;

    setup(async () => {
        persistence = new ProcessStatesMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new ProcessStatesController();
        controller.configure(new ConfigParams());

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );

        service = new ProcessStatesCommandableHttpServiceV1();
        service.configure(httpConfig);

        client = new ProcessStatesCommandableHttpClientV1();
        client.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('service-processstates', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-processstates', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-processstates', 'service', 'commandable-http', 'default', '1.0'), service,
            new Descriptor('service-processstates', 'client', 'commandable-http', 'default', '1.0'), client
        );
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);

        fixture = new ProcessStatesClientV1Fixture(client, persistence);

        await persistence.open(null);
        await service.open(null);
        await client.open(null);
    });

    teardown(async () => {
        await client.close(null);
        await service.close(null);
        await persistence.close(null);
    });

    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

    test('Get Process by null Id', async () => {
        await fixture.testGetProcessbynullId();
    });

    test('Continue Process', async () => {
        await fixture.testContinueProcess();
    });

    test('Try Continue Process with not exist id', async () => {
        await fixture.testTryContinueProcessWithnotExistId();
    });

    test('Try Continue Process with null id', async () => {
        await fixture.testTryContinueProcessWithNullId();
    });

    test('Abort Proces', async () => {
        await fixture.testAbortProces();
    });

    test('Continuie With Recovery Process', async () => {
        await fixture.testContinuieWithRecoveryProcess();
    });

    test('Complete Process', async () => {
        await fixture.testCompleteProcess();
    });

    test('Request For Response Process', async () => {
        await fixture.testRequestForResponseProcess();
    });

    test('Rollback Process With Status Running', async () => {
        await fixture.testRollbackProcessWithStatusRunning();
    });

    test('Rollback Process With State Starting', async () => {
        await fixture.testRollbackProcessWithStateStarting();
    });

    test('Fail Process', async () => {
        await fixture.testFailProcess();
    });

    test('Fail With Recovery Process', async () => {
        await fixture.testFailWithRecoveryProcess();
    });

    test('Continue For Fail Process', async () => {
        await fixture.testContinueForFailProcess();
    });

    test('Repeat Recovery Process', async () => {
        await fixture.testRepeatRecoveryProcess();
    });

    test('Return Error If Process State Dont Equal Starting', async () => {
        await fixture.testReturnErrorIfProcessStateDontEqualStarting();
    });

    test('Start', async () => {
        await fixture.testStart();
    });

    test('Start Or Activate Process', async () => {
        await fixture.testStartOrActivateProcess();
    });

    test('Return Error If Resume Started Without Process', async () => {
        await fixture.testReturnErrorIfResumeStartedWithoutProcess();
    });

    test('Return Error If Resume Started Without Process Id', async () => {
        await fixture.testReturnErrorIfResumeStartedWithoutProcessId();
    });

    test('Return Error If Process Type Null', async () => {
        await fixture.testReturnErrorIfProcessTypeNull();
    });

    test('Return Error If Process Key Null', async () => {
        await fixture.testReturnErrorIfProcessKeyNull();
    });

    test('Resume Without Completed Tasks Process', async () => {
        await fixture.testResumeWithoutCompletedTasksProcess();
    });

    test('Resume With Completed Tasks Process', async () => {
        await fixture.testResumeWithCompletedTasksProcess();
    });

    test('Clear Recovery Message In Process', async () => {
        await fixture.testClearRecoveryMessageInProcess();
    });

    test('Update Process', async () => {
        await fixture.testUpdateProcess();
    });

    test('Delete Process', async () => {
        await fixture.testDeleteProcess();
    });

});