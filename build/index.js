"use strict";
(function () {
    let _______serverTime;
    let _______now;
    async function loadServerTime() {
        const response = await fetch('https://timers.linagirl.workers.dev/', {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch server time: the server returned the status code ${response.status}`);
        }
        const json = await response.json();
        return new Date(json.date);
    }
    (async () => {
        try {
            const currentServerTime = await loadServerTime();
            _______serverTime = currentServerTime;
            _______now = Date.now();
        }
        catch (e) {
            console.log(`Failed to initialize server time: ${e.message}`, e);
        }
    })();
    window.serverTime = {
        getTime() {
            if (!_______serverTime) {
                throw new Error(`Cannot get server time before it is initialized`);
            }
            const currentTime = new Date(_______serverTime);
            const timeDiff = Date.now() - _______now;
            currentTime.setMilliseconds(currentTime.getMilliseconds() + timeDiff);
            return currentTime;
        },
        async getTimeAsync() {
            return await loadServerTime();
        },
        isLaterThan(isoDateString) {
            const timeToTest = new Date(isoDateString);
            const currentServerTime = this.getTime();
            return timeToTest.getTime() < currentServerTime.getTime();
        },
        async isLaterThanAsync(isoDateString) {
            const timeToTest = new Date(isoDateString);
            const currentServerTime = await this.getTimeAsync();
            return timeToTest.getTime() < currentServerTime.getTime();
        }
    };
})();
//# sourceMappingURL=index.js.map