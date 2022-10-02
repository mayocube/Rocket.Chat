import { Box, Table, Flex } from '@rocket.chat/fuselage';
import { useAutoFocus } from '@rocket.chat/fuselage-hooks';
import { useRoute, useTranslation } from '@rocket.chat/ui-contexts';
import React, { useMemo, useState, useCallback } from 'react';

import FilterByText from '../../../../components/FilterByText';
import GenericTable from '../../../../components/GenericTable';
import MarkdownText from '../../../../components/MarkdownText';
import UserAvatar from '../../../../components/avatar/UserAvatar';
import { useEndpointData } from '../../../../hooks/useEndpointData';
import { useFormatDate } from '../../../../hooks/useFormatDate';
import { useQuery } from './hooks';

function ForwardUsersTable({ permalink = "", workspace = 'local', onForward = (username: any) => { }, onClose = () => { } }) {
    const [params, setParams] = useState({ current: 0, itemsPerPage: 25 });
    const [sort, setSort] = useState(['name', 'asc']);
    //const canViewFullOtherUserInfo = usePermission('view-full-other-user-info');
    const t = useTranslation();

    //const federation = workspace === 'external';

    const query = useQuery(params, sort, 'users', workspace);

    const onHeaderClick = useCallback(
        (id) => {
            const [sortBy, sortDirection] = sort;

            if (sortBy === id) {
                setSort([id, sortDirection === 'asc' ? 'desc' : 'asc']);
                return;
            }
            setSort([id, 'asc']);
        },
        [sort],
    );

    const header = useMemo(
        () =>
            [
                <GenericTable.HeaderCell key={'name'} direction={sort[1]} active={sort[0] === 'name'} onClick={onHeaderClick} sort='name'>
                    {t('Name')}
                </GenericTable.HeaderCell>,
                <GenericTable.HeaderCell key={'action'}>
                    {t('Actions')}
                </GenericTable.HeaderCell>
            ].filter(Boolean),
        [sort, onHeaderClick, t],
    );

    const directRoute = useRoute('direct');

    const { value: data = {} } = useEndpointData('/v1/directory', query);

    const onClick = useCallback(
        (username, _id) => (e) => {
            if (e.type === 'click' || e.key === 'Enter') {
                onForward(username , 'd');
            }
        },
        [directRoute],
    );

    const formatDate = useFormatDate();

    const renderRow = useCallback(
        ({ _id, username, name, bio, avatarETag, nickname }) => (
            <Table.Row key={_id} onKeyDown={onClick(username, _id)} onClick={onClick(username, _id)} tabIndex={0} role='link' action>
                <Table.Cell>
                    <Flex.Container>
                        <Box>
                            <Flex.Item>
                                <UserAvatar size='x40' title={username} username={username} etag={avatarETag} />
                            </Flex.Item>
                            <Box withTruncatedText grow={1} mi='x8'>
                                <Box display='flex'>
                                    <Box fontScale='p2m' withTruncatedText>
                                        {name || username}
                                        {nickname && ` (${nickname})`}
                                    </Box>{' '}
                                    <Box mi='x4' />{' '}
                                    <Box fontScale='p2' color='hint' withTruncatedText>
                                        {username}
                                    </Box>
                                </Box>
                                <MarkdownText variant='inline' fontScale='p2' color='hint' content={bio} />
                            </Box>
                        </Box>
                    </Flex.Container>
                </Table.Cell>
                <Table.Cell withTruncatedText>{t("Forward_Message")}</Table.Cell>
            </Table.Row>
        ),
        [formatDate, onClick],
    );

    const refAutoFocus = useAutoFocus(true);

    return (
        <>
            {
                <>
                    <style>
                        {`.rc-scrollbars-container { min-height: 300px; }`}
                    </style>
                </>
            }
            <GenericTable
                header={header}
                renderFilter={({ onChange, ...props }) => (
                    <FilterByText placeholder={t('Search_Users')} inputRef={refAutoFocus} onChange={onChange} {...props} />
                )}
                renderRow={renderRow}
                results={data.result}
                setParams={setParams}
                total={data.total}
            />
        </>

    );
}

export default ForwardUsersTable;
