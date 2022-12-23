import { ProcessStatesMockClientV1 } from '../../src/version1/ProcessStatesMockClientV1';
import { ProcessStatesMockClientV1Fixture } from './ProcessStatesMockClientV1Fixture';


suite('ProcessStatesMockClientV1', () => {
    let client: ProcessStatesMockClientV1;
    let fixture: ProcessStatesMockClientV1Fixture;

    setup(async () => {
        client = new ProcessStatesMockClientV1();
        fixture = new ProcessStatesMockClientV1Fixture(client);
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