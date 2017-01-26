const fetch = require('node-fetch');

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var checks = 0;
function check() {
    const airpodUrlPart = "MMEF2AM%2FA";
    const airpodPart = "MMEF2AM/A";

    const iPhoneUrlPart = "MN9D2LL%2FA";
    const iPhonePart = "MN9D2LL/A";

    const urlPart = airpodUrlPart;
    const part = airpodPart;

	// const urlPart = iPhoneUrlPart;
	// const part = iPhonePart;

    fetch("http://www.apple.com/shop/retail/pickup-message?parts.0=" + urlPart + "&location=48230")
        .then(res => res.json())
        .then(json => {
            checks += 1;
            var stores = json.body.stores;
            var available = [];
            var dates = [];
            for(var store in stores){
                var avail = stores[store].partsAvailability[part].storePickupQuote;
                if(avail.startsWith('Today') || avail.startsWith('Tomorrow')) {
                    available.push(stores[store].storeName);
                }
                else {
                    dates.push(stores[store].partsAvailability[part].storePickupQuote);
                }
            }
            if(available.length < 1) {
                console.log(dates);
                console.log(checks + " ----------------- ");
                setTimeout(check, Math.floor(Math.random() * 15000) + 5000);
            }
            else {
                console.log(available);
                client.messages.create({
                    to: process.env.PHONE_NUMBER,
					from: process.env.FROM_PHONE_NUMBER,
                    body: 'Items have become available'
                }, function(err, message) {
                    console.log(message.sid);
                });

            }
        });
}

check();
