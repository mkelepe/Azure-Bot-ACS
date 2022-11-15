// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, Text, TextField } from '@fluentui/react';
import heroSVG from '../../assets/hero.svg';
import { imgStyle, infoContainerStyle, callContainerStackTokens, callOptionsGroupStyles, configContainerStyle, configContainerStackTokens, containerStyle, containerTokens, headerStyle, teamsItemStyle, buttonStyle } from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
export const HomeScreen = (props) => {
    const imageProps = { src: heroSVG.toString() };
    const headerTitle = props.joiningExistingCall ? 'Join Call' : 'Start or join a call';
    const callOptionsGroupLabel = 'Select a call option';
    const buttonText = 'Next';
    const callOptions = [
        { key: 'TeamsMeeting', text: 'Join a Teams meeting' }
    ];
    // Get display name from local storage if available
    const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
    const [displayName, setDisplayName] = useState(defaultDisplayName !== null && defaultDisplayName !== void 0 ? defaultDisplayName : undefined);
    const [chosenCallOption, setChosenCallOption] = useState(callOptions[0]);
    const [callLocator, setCallLocator] = useState();
    // const startGroupCall: boolean = chosenCallOption.key === 'ACSCall';
    const teamsCallChosen = chosenCallOption.key === 'TeamsMeeting';
    // const buttonEnabled = displayName && (startGroupCall || (teamsCallChosen && callLocator));
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const my_meeting_url = urlParams.get('teamsLink') || '';
    const my_name = urlParams.get('name') || 'user';
    // const myDisplayName:string = urlParams.get('my_display_name') || ''
    // setCallLocator({ meetingLink: my_meeting_url })
    const myCallLocator = { meetingLink: my_meeting_url };
    // setDisplayName(myDisplayName)
    props.startCallHandler({
        displayName: my_name,
        callLocator: myCallLocator
    });
    return (React.createElement(Stack, { horizontal: true, wrap: true, horizontalAlign: "center", verticalAlign: "center", tokens: containerTokens, className: containerStyle },
        React.createElement(Image, Object.assign({ alt: "Welcome to the ACS Calling sample app", className: imgStyle }, imageProps)),
        React.createElement(Stack, { className: infoContainerStyle },
            React.createElement(Text, { role: 'heading', "aria-level": 1, className: headerStyle }, headerTitle),
            React.createElement(Stack, { className: configContainerStyle, tokens: configContainerStackTokens },
                React.createElement(Stack, { tokens: callContainerStackTokens },
                    !props.joiningExistingCall && (React.createElement(ChoiceGroup, { styles: callOptionsGroupStyles, label: callOptionsGroupLabel, defaultSelectedKey: "ACSCall", options: callOptions, required: true, onChange: (_, option) => option && setChosenCallOption(option) })),
                    teamsCallChosen && (React.createElement(TextField, { className: teamsItemStyle, iconProps: { iconName: 'Link' }, placeholder: 'Enter a Teams meeting link', onChange: (_, newValue) => newValue && setCallLocator({ meetingLink: newValue }) }))),
                React.createElement(DisplayNameField, { defaultName: displayName, setName: setDisplayName }),
                React.createElement(PrimaryButton
                // disabled={!buttonEnabled}
                , { 
                    // disabled={!buttonEnabled}
                    className: buttonStyle, text: buttonText, onClick: () => {
                        if (displayName) {
                            saveDisplayNameToLocalStorage(displayName);
                            props.startCallHandler({
                                displayName,
                                callLocator
                            });
                        }
                    } }),
                React.createElement("div", null,
                    React.createElement(ThemeSelector, { label: "Theme", horizontal: true }))))));
};
//# sourceMappingURL=HomeScreen.js.map