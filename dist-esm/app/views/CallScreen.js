// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CallComposite, toFlatCommunicationIdentifier, useAzureCommunicationCallAdapter } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { useIsMobile } from '../utils/useIsMobile';
export const CallScreen = (props) => {
    const { token, userId, callLocator, displayName, onCallEnded } = props;
    const callIdRef = useRef();
    const { currentTheme, currentRtl } = useSwitchableFluentTheme();
    const isMobileSession = useIsMobile();
    const afterCreate = useCallback((adapter) => __awaiter(void 0, void 0, void 0, function* () {
        adapter.on('callEnded', () => {
            onCallEnded();
        });
        adapter.on('error', (e) => {
            // Error is already acted upon by the Call composite, but the surrounding application could
            // add top-level error handling logic here (e.g. reporting telemetry).
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state) => {
            var _a, _b, _c;
            const pageTitle = convertPageStateToString(state);
            document.title = `${pageTitle} - ${WEB_APP_TITLE}`;
            if (((_a = state === null || state === void 0 ? void 0 : state.call) === null || _a === void 0 ? void 0 : _a.id) && callIdRef.current !== ((_b = state === null || state === void 0 ? void 0 : state.call) === null || _b === void 0 ? void 0 : _b.id)) {
                callIdRef.current = (_c = state === null || state === void 0 ? void 0 : state.call) === null || _c === void 0 ? void 0 : _c.id;
                console.log(`Call Id: ${callIdRef.current}`);
            }
        });
        return adapter;
    }), [callIdRef, onCallEnded]);
    const credential = useMemo(() => createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token), [token, userId]);
    const adapter = useAzureCommunicationCallAdapter({
        userId,
        displayName,
        credential,
        locator: callLocator
    }, afterCreate);
    // Dispose of the adapter in the window's before unload event.
    // This ensures the service knows the user intentionally left the call if the user
    // closed the browser tab during an active call.
    useEffect(() => {
        const disposeAdapter = () => adapter === null || adapter === void 0 ? void 0 : adapter.dispose();
        window.addEventListener('beforeunload', disposeAdapter);
        return () => window.removeEventListener('beforeunload', disposeAdapter);
    }, [adapter]);
    if (!adapter) {
        return React.createElement(Spinner, { label: 'Creating adapter', ariaLive: "assertive", labelPosition: "top" });
    }
    const callInvitationUrl = window.location.href;
    return (React.createElement(CallComposite, { adapter: adapter, fluentTheme: currentTheme.theme, rtl: currentRtl, callInvitationUrl: callInvitationUrl, formFactor: isMobileSession ? 'mobile' : 'desktop' }));
};
const convertPageStateToString = (state) => {
    switch (state.page) {
        case 'accessDeniedTeamsMeeting':
            return 'error';
        case 'leftCall':
            return 'end call';
        case 'removedFromCall':
            return 'end call';
        default:
            return `${state.page}`;
    }
};
//# sourceMappingURL=CallScreen.js.map