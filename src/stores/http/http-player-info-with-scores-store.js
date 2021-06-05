import createHttpStore from './http-store';
import apiPlayerWithScoresProvider from '../../network/scoresaber/player/api-info-with-scores'
import {opt} from '../../utils/js'

export default (playerId = null, scoresType = 'recent', scoresPage = 1, initialState = null) => {
  let currentPlayerId = playerId;
  let currentScoresType = scoresType;
  let currentScoresPage = scoresPage;

  const onNewData = ({fetchParams}) => {
    currentPlayerId = opt(fetchParams, 'playerId', null);
    currentScoresType = opt(fetchParams, 'scoresType', null);
    currentScoresPage = opt(fetchParams, 'scoresPage', null);
  }

  const httpStore = createHttpStore(
    apiPlayerWithScoresProvider,
    playerId ? {playerId, scoresType, scoresPage} : null,
    initialState,
    {
      onInitialized: onNewData,
      onAfterStateChange: onNewData,
    },
  );

  const fetch = async (playerId = currentPlayerId, scoresType = currentScoresType, scoresPage = currentScoresPage, force = false) => {
    if (
      (!playerId || playerId === currentPlayerId) &&
      (!scoresType || scoresType === currentScoresType) &&
      (!scoresPage || scoresPage === currentScoresPage) &&
      !force
    )
      return false;

    return httpStore.fetch({playerId, scoresType, scoresPage}, force, apiPlayerWithScoresProvider);
  }

  return {
    ...httpStore,
    fetch,
    getPlayerId: () => currentPlayerId,
    getType: () => currentScoresType,
    setType: type => currentScoresType = type,
    getPage: () => currentScoresPage,
    setPage: page => currentScoresPage = page,
  }
}

