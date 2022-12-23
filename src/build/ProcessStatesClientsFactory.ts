import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { ProcessStatesDirectClientV1 } from '../version1/ProcessStatesDirectClientV1';
import { ProcessStatesMockClientV1 } from '../version1/ProcessStatesMockClientV1';
import { ProcessStatesCommandableHttpClientV1 } from '../version1/ProcessStatesCommandableHttpClientV1';
import { ProcessStatesNullClientV1 } from '../version1/ProcessStatesNullClientV1';


export class ProcessStatesClientsFactory extends Factory {
	public static Descriptor = new Descriptor("client-processstates", "factory", "default", "default", "1.0");
	public static DirectClientDescriptor = new Descriptor("client-processstates", "client", "direct", "*", "1.0");
	public static MockClientDescriptor = new Descriptor("client-processstates", "client", "mock", "*", "1.0");
	public static HttpClientDescriptor = new Descriptor("client-processstates", "client", "commandable-http", "*", "1.0");
	public static NullClientDescriptor = new Descriptor("client-processstates", "client", "null", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ProcessStatesClientsFactory.DirectClientDescriptor, ProcessStatesDirectClientV1);
		this.registerAsType(ProcessStatesClientsFactory.MockClientDescriptor, ProcessStatesMockClientV1);
		this.registerAsType(ProcessStatesClientsFactory.HttpClientDescriptor, ProcessStatesCommandableHttpClientV1);
		this.registerAsType(ProcessStatesClientsFactory.NullClientDescriptor, ProcessStatesNullClientV1);
	}
	
}
