/// <reference types="react" />
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapterLocator } from '@azure/communication-react';
export interface CallScreenProps {
    token: string;
    userId: CommunicationUserIdentifier;
    callLocator: CallAdapterLocator;
    displayName: string;
    onCallEnded: () => void;
}
export declare const CallScreen: (props: CallScreenProps) => JSX.Element;
//# sourceMappingURL=CallScreen.d.ts.map