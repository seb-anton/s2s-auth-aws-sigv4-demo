import { CredentialsProvider } from "./credentialsProvider";
import { Credentials } from "../interceptor";
export declare class SimpleCredentialsProvider implements CredentialsProvider {
    private readonly credentials?;
    constructor(credentials?: Credentials | undefined);
    getCredentials(): Promise<Credentials | undefined>;
}
