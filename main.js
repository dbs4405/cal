
var fb = new Firebase("https://dbschain.firebaseio.com/");

var whenDataLoaded = $.Deferred();
var appData;

fb.on('value', function (snapshot) {  
    $('.block').remove();

    if (snapshot && snapshot.val() && typeof snapshot.val() === 'object') {
        appData = snapshot.val();

        appData = _.uniq(appData);

        var previousDate = null;
        appData.forEach(function (item, index) {

            if (previousDate) {
                var momentObj = moment(item, 'MM/DD/YYYY');
                var differenceInDays = momentObj.diff(previousDate, 'days');

                if (differenceInDays > 1) {
                    // add this many days to the rendered amount
                    var addThisManyBlankBlocks = differenceInDays - 1;

                    for (var i=0; i < addThisManyBlankBlocks; i++) {
                        makeBlock('blank');
                    }
                }

            }

            makeBlock(item);

            previousDate = moment(item, 'MM/DD/YYYY');
        });
    } else {
        appData = [];
    }

    whenDataLoaded.resolve();
});

function makeBlock (currentDay) {  
    if (currentDay !== 'blank') {
        var momentObj = moment(currentDay, 'MM/DD/YYYY');
        var dayOfMonth = momentObj.date();
        var monthName = momentObj.format('MMMM');
        var year = momentObj.format('YYYY');

        $('<div></div>')
            .append('<div>' + monthName + '</div>')
            .append('<div class="day-of-month">' + dayOfMonth + '</div>')
            .append('<div class="year">' + year + '</div>')
            .addClass('block')
            .appendTo('body');
    } else {
        $('<div></div>')
            .append('<div>&nbsp;</div>')
            .append('<div class="day-of-month">x</div>')
            .append('<div class="year">&nbsp;</div>')
            .addClass('block blank')
            .appendTo('body');
    }
}

function saveDate (newDate) {
	whenDataLoaded.done(function () {
		if (appData) {
			appData.push(newDate);

		} else {
			appData = [newDate];
		}

		fb.set(appData);
	});
}

$('.main-button').click(function (event) {
	event.preventDefault();
	saveDate(moment().format('MM/DD/YYYY'));
});

function clearData () {
	fb.set([]);
}