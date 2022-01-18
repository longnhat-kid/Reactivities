import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import useStores from '../../../app/stores/stores';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityPlaceholder from './ActivityPlaceholder';

export default observer(function ActivityDashboard(){
    const {activityStore} = useStores();
    const [loadingNext, setLoadingNext] = useState(false);

    function handleLoadingNext(){
        setLoadingNext(true);
        activityStore.setPagingParams(new PagingParams(activityStore.pagination!.currentPage + 1));
        activityStore.loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() =>{
        activityStore.loadActivities();
    }, [activityStore])

    return(
        <Grid>
            <Grid.Column width='10'>
                {activityStore.isLoading && !loadingNext ? (
                    <>
                        <ActivityPlaceholder/>
                        <ActivityPlaceholder/>
                        <ActivityPlaceholder/>
                    </>
                ): (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleLoadingNext}
                        hasMore={!loadingNext && !!activityStore.pagination && activityStore.pagination.currentPage < activityStore.pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
                
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters/>
            </Grid.Column>
            <Grid.Column width='10'>
                {loadingNext && (
                    <>
                        <ActivityPlaceholder/>
                        <ActivityPlaceholder/>
                        <ActivityPlaceholder/>
                    </>
                )}
            </Grid.Column>
        </Grid>
    )
})