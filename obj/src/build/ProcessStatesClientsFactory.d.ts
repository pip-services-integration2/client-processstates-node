import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
export declare class ProcessStatesClientsFactory extends Factory {
    static Descriptor: Descriptor;
    static DirectClientDescriptor: Descriptor;
    static MemoryClientDescriptor: Descriptor;
    static HttpClientDescriptor: Descriptor;
    static NullClientDescriptor: Descriptor;
    constructor();
}
