import type * as MessageParser from '@rocket.chat/message-parser';
type EmojiElementProps = MessageParser.Emoji;

const detectTextIfBigEmoji = (emoji: EmojiElementProps[]) => {
    let txtToken: any[] = [];
    emoji.map((emoji:EmojiElementProps) => {
        if(emoji?.value?.value?.trim() === "8)") {
            txtToken.push(emoji?.value);
        }
    });
    return txtToken;
}

const detectTextIfEmoji = (emoji: EmojiElementProps) => {
    if(emoji?.value?.value?.trim() === "8)"){
        return true;
    }
    return false;
}

export { detectTextIfEmoji, detectTextIfBigEmoji };