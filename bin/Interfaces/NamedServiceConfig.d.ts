import { ServiceConfigInterface } from "./ServiceConfigInterface";
export interface NamedServiceConfig {
    [key: string]: ServiceConfigInterface;
}
