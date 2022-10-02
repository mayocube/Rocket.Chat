import { Box, Table, Avatar, Icon } from '@rocket.chat/fuselage';
import { useMediaQuery, useAutoFocus } from '@rocket.chat/fuselage-hooks';
import { useRoute, useTranslation } from '@rocket.chat/ui-contexts';
import React, { useMemo, useState, useCallback } from 'react';

import FilterByText from '../../../../components/FilterByText';
import GenericTable from '../../../../components/GenericTable';
import MarkdownText from '../../../../components/MarkdownText';
import { useEndpointData } from '../../../../hooks/useEndpointData';
import { useFormatDate } from '../../../../hooks/useFormatDate';
import { roomCoordinator } from '../../../../lib/rooms/roomCoordinator';


import { useQuery } from './hooks';

const style = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
};

function ForwardChannelsTable({ onForward = (username: any , type: any) => { } }) {
    const t = useTranslation();
    const refAutoFocus = useAutoFocus(true);
    const [sort, setSort] = useState(['name', 'asc']);
    const [params, setParams] = useState({ current: 0, itemsPerPage: 25 });

    const mediaQuery = useMediaQuery('(min-width: 768px)');

    const query = useQuery(params, sort, 'channels');

    const onHeaderClick = useCallback(
        (id) => {
            console.log(id)
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
        [sort, onHeaderClick, t, mediaQuery],
    );

    const channelRoute = useRoute('channel');
    const groupsRoute = useRoute('group');

    const { value: data = {} } = useEndpointData('/v1/directory', query);

    const onClick = useMemo(
        () => (name, type) => (e) => {
            console.log(name)
            if (e.type === 'click' || e.key === 'Enter') {
                //type === 'c' ? channelRoute.push({ name }) : groupsRoute.push({ name });
                onForward(name , 'c');
            }
        },
        [channelRoute, groupsRoute],
    );

    const formatDate = useFormatDate();
    const renderRow = useCallback(
        (room) => {
            const { _id, name, fname, topic } = room;
            const avatarUrl = roomCoordinator.getRoomDirectives('c')?.getAvatarPath(room);

            return (
                <Table.Row key={_id} onKeyDown={onClick(name, t)} onClick={onClick(name, t)} tabIndex={0} role='link' action>
                    <Table.Cell>
                        <Box display='flex'>
                            <Box flexGrow={0}>
                                <Avatar size='x40' title={fname || name} url={avatarUrl} />
                            </Box>
                            <Box grow={1} mi='x8' style={style}>
                                <Box display='flex' alignItems='center'>
                                    <Icon name={roomCoordinator.getIcon(room)} color='hint' />{' '}
                                    <Box fontScale='p2m' mi='x4'>
                                        {fname || name}
                                    </Box>
                                </Box>
                                {topic && <MarkdownText variant='inlineWithoutBreaks' fontScale='p2' color='hint' style={style} content={topic} />}
                            </Box>
                        </Box>
                    </Table.Cell>
                    <Table.Cell withTruncatedText>{t("Forward_Message")}</Table.Cell>
                </Table.Row>
            );
        },
        [formatDate, mediaQuery, onClick],
    );

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
                    <FilterByText placeholder={t('Search_Channels')} inputRef={refAutoFocus} onChange={onChange} {...props} />
                )}
                renderRow={renderRow}
                results={data.result}
                setParams={setParams}
                total={data.total}
            />
        </>
    );
}

export default ForwardChannelsTable;
