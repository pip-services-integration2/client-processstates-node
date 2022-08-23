"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesClientsFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const ProcessStatesDirectClientV1_1 = require("../version1/ProcessStatesDirectClientV1");
const ProcessStatesMemoryClientV1_1 = require("../version1/ProcessStatesMemoryClientV1");
const ProcessStatesHttpClientV1_1 = require("../version1/ProcessStatesHttpClientV1");
const ProcessStatesNullClientV1_1 = require("../version1/ProcessStatesNullClientV1");
class ProcessStatesClientsFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(ProcessStatesClientsFactory.DirectClientDescriptor, ProcessStatesDirectClientV1_1.ProcessStatesDirectClientV1);
        this.registerAsType(ProcessStatesClientsFactory.MemoryClientDescriptor, ProcessStatesMemoryClientV1_1.ProcessStatesMemoryClientV1);
        this.registerAsType(ProcessStatesClientsFactory.HttpClientDescriptor, ProcessStatesHttpClientV1_1.ProcessStatesHttpClientV1);
        this.registerAsType(ProcessStatesClientsFactory.NullClientDescriptor, ProcessStatesNullClientV1_1.ProcessStatesNullClientV1);
    }
}
exports.ProcessStatesClientsFactory = ProcessStatesClientsFactory;
ProcessStatesClientsFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("client-processstates", "factory", "default", "default", "1.0");
ProcessStatesClientsFactory.DirectClientDescriptor = new pip_services3_commons_nodex_1.Descriptor("client-processstates", "client", "direct", "*", "1.0");
ProcessStatesClientsFactory.MemoryClientDescriptor = new pip_services3_commons_nodex_1.Descriptor("client-processstates", "client", "memory", "*", "1.0");
ProcessStatesClientsFactory.HttpClientDescriptor = new pip_services3_commons_nodex_1.Descriptor("client-processstates", "client", "http", "*", "1.0");
ProcessStatesClientsFactory.NullClientDescriptor = new pip_services3_commons_nodex_1.Descriptor("client-processstates", "client", "null", "*", "1.0");
//# sourceMappingURL=ProcessStatesClientsFactory.js.map