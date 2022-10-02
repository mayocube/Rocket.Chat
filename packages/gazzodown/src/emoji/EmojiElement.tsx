import type * as MessageParser from '@rocket.chat/message-parser';
import { ReactElement, memo } from 'react';

import Emoji from './Emoji';
import { detectTextIfEmoji } from './EmojiUtils';
import PlainSpan from '../elements/PlainSpan';

type EmojiElementProps = MessageParser.Emoji;

const EmojiElement = (emoji: EmojiElementProps, {key}: any): ReactElement => { 
    if(detectTextIfEmoji(emoji)) {
        return <PlainSpan key={key} text={emoji?.value?.value || ""} />;
    }
    return ( 
        <Emoji {...emoji} /> 
    ) 
};

export default memo(EmojiElement);
