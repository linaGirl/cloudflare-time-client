(function() {
    let _______serverTime : Date;
    let _______now : number;


    interface IServerResponse {
        status: string;
        date: string;
    }


    async function loadServerTime() : Promise<Date> {
        const response = await fetch('https://timers.linagirl.workers.dev/', {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });
        
        if (response.status === 429) {
            // use the systems time as fallback when cloudflare 
            // is blocking the request
            return new Date();
        } else if (response.status !== 200) {
            throw new Error(`Failed to fetch server time: the server returned the status code ${response.status}`);
        }

        const json : IServerResponse = await response.json();
        return new Date(json.date);
    }


    (async() => {
        try {
            const currentServerTime = await loadServerTime();
            _______serverTime = currentServerTime;
            _______now = Date.now();
        } catch (e: any) {
            console.log(`Failed to initialize server time: ${e.message}`, e);
        }
    })();


    (<any>window).serverTime = {
        getTime() : Date {
            if (!_______serverTime) {
                throw new Error(`Cannot get server time before it is initialized`);
            }

            const currentTime = new Date(_______serverTime);
            const timeDiff : number = Date.now() - _______now;
            currentTime.setMilliseconds(currentTime.getMilliseconds() + timeDiff);
            return currentTime;
        },

        async getTimeAsync() : Promise<Date> {
            return await loadServerTime();
        },


        isLaterThan(isoDateString: string) : boolean {
            const timeToTest = new Date(isoDateString);
            const currentServerTime = this.getTime();
            return timeToTest.getTime() < currentServerTime.getTime();
        },


        async isLaterThanAsync(isoDateString: string) : Promise<boolean> {
            const timeToTest = new Date(isoDateString);
            const currentServerTime = await this.getTimeAsync();
            return timeToTest.getTime() < currentServerTime.getTime();
        }
    };
})();

