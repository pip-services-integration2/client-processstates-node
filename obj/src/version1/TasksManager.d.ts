import { MessageV1 } from "./MessageV1";
import { ProcessStateV1 } from "./ProcessStateV1";
import { TaskStateV1 } from "./TaskStateV1";
export declare class TasksManager {
    static hasCompletedTasks(process: ProcessStateV1): boolean;
    static getExecutingTasks(process: ProcessStateV1): TaskStateV1;
    static startTasks(process: ProcessStateV1, taskType: string, queueName: string, message: MessageV1): void;
    static failTasks(process: ProcessStateV1, errorMessage: string): void;
    static getErrorMessage(process: ProcessStateV1): string;
    static rollbackTasks(process: ProcessStateV1): void;
    static completeTasks(process: ProcessStateV1): void;
}
