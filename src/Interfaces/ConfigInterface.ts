import {NamedServiceConfig} from "./NamedServiceConfig";

export interface ConfigInterface {
  services: NamedServiceConfig;
  parameters: Object;
  imports: string[];
}

