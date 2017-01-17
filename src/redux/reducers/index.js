/**
 * Created by jarosanger on 10/15/16.
 */
import auth from './auth';
import user from './user';
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
    ...user,
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
