import auth from './auth';
import profile from './profile';
import videos from './videos';
import project from './project';
import artwork from './artwork';
import tracks from './tracks';
import build from './build';
import provider from './provider';
import loading from './loading';
import notifications from './notifications';

module.exports = {
    ...auth,
    ...profile,
    ...videos,
    ...project,
    ...artwork,
    ...tracks,
    ...build,
    ...provider,
    ...loading,
    ...notifications,
};
