import type * as MessageParser from '@rocket.chat/message-parser';
import type { ReactElement } from 'react';

import { detectTextIfBigEmoji } from './EmojiUtils';
import BigEmojiElement from './BigEmojiElement';
import ParagraphBlock from '../blocks/ParagraphBlock';

type BigEmojiBlockProps = {
	emoji: MessageParser.Emoji[];
};

const BigEmojiBlock = ({ emoji }: BigEmojiBlockProps, {key}: any): ReactElement => {
	let txtToken: BigEmojiBlockProps["emoji"] = detectTextIfBigEmoji(emoji);
	if(txtToken.length > 0){
		return <ParagraphBlock key={key} children={txtToken} />;
	}
	return (
		<div role='presentation'>
			{emoji.map((emoji, index) => (
				<BigEmojiElement key={index} {...emoji} />
			))}
		</div>
	)
};

export default BigEmojiBlock;
