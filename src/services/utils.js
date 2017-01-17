/**
 * Created by jarosanger on 8/15/16.
 */
export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
    return response.json()

}

export function getArrayIndex(id, arr) {
    let index = -1;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

export function getSecondsFromDuration(duration) {
    const times = duration.split(':');
    let seconds = 0;
    if(times.length == 1) {
        seconds += parseInt(times[0]);
    }
    else if(times.length == 2) {
        seconds += parseInt(times[0]) * 60;
        seconds += parseInt(times[1]);
    }
    else if(times.length == 3) {
        seconds += parseInt(times[0]) * 3600;
        seconds += parseInt(times[1]) * 60;
        seconds += parseInt(times[2]);
    }

    return seconds;
}

export function getObjectValue(obj, keys, defaultValue) {
    for(let i=0; i<keys.length; i++) {
        if(obj[keys[i]] !== undefined)
            obj = obj[keys[i]];
        else
            obj = defaultValue;
    }

    return obj;
}

export function getProviderById(id, providers) {
    let returnProvider = null;
    providers.every(provider => {
        if(provider.id == id) {
            returnProvider = provider;
            return false;
        }
        else
            return true;
    });

    return returnProvider;
}

export function getProviderIdByName(name, providers) {
    let providerId = 0;
    providers.every(provider => {
        if(provider.name.toLowerCase() == name) {
            providerId = provider.id;
            return false;
        }
        else
            return true;
    });

    return providerId;
}

export function parseNotificationMessageHtml(str) {
    let link = {
        html: false,
        obj: '',
        id: '',
        text: '',
        before: '',
        after: ''
    };

    if(!str || str != "")
        return link;

    let pos = str.indexOf('<a');
    let pos2 = str.indexOf('a>');
    if(pos === -1 || pos2 === -1)
        return link;

    let $html = $(str.substring(pos, pos2 + 2));

    link.obj = $html.data("obj");
    link.id = $html.data("oid");
    link.text = $html.text();
    link.before = str.substring(0, pos - 1);
    link.after = str.substring(pos2 + 3, str.length - 1);
    link.html = true;

    return link;
}
