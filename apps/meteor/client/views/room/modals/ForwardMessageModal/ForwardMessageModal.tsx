import { IMessage } from '@rocket.chat/core-typings';
import { TextAreaInput, FieldGroup, Field, Box, Tabs } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { ReactElement, useState } from 'react';

import GenericModal from '../../../../components/GenericModal';
import ForwardChannelsTable from './ForwardChannelsTable';
import ForwardUsersTable from './ForwardUsersTable';

type ForwardMessageModalProps = {
	onClose: () => void;
	onForward: (username: any , type: any) => void;
	permalink?: string;
	messageId: IMessage['_id'];
};

const ForwardMessageModal = ({ permalink, messageId, onClose, onForward }: ForwardMessageModalProps): ReactElement => {
	const t = useTranslation();
	const [activeTab, setActiveTab] = useState('channels');

	return (
		<GenericModal
			variant='info'
			title={t('Forward_chat')}
			onClose={onClose}
			onCancel={onClose}
			onConfirm={onClose}
		>
			<Tabs flexShrink={0}>
				<Tabs.Item selected={activeTab === 'channels'} onClick={() => setActiveTab('channels')}>
					{t('Channels')}
				</Tabs.Item>
				<Tabs.Item selected={activeTab === 'users'} onClick={() => setActiveTab('users')}>
					{t('Users')}
				</Tabs.Item>
			</Tabs>
			{activeTab === 'users' && <ForwardUsersTable permalink={permalink} onForward={onForward} onClose={onClose} />}
			{activeTab === 'channels' && <ForwardChannelsTable onForward={onForward} />}
			
		</GenericModal>
	);
};

export default ForwardMessageModal;
