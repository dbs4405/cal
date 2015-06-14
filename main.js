
var fb = new Firebase("https://dbschain.firebaseio.com/");

var whenDataLoaded = $.Deferred();
var appData;
var good = 0;
var bad = 0;

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

function tally (good, bad) {
    console.log ("Total days =  " + (good + bad));
    console.log(("Good days = " + good));
}


function makeBlock (currentDay) {  
    console.log("test");
    if (currentDay !== 'blank') {
        good++;
        console.log("good = ");
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
        bad++;
        $('<div></div>')
            .append('<div>&nbsp;</div>')
            .append('<div class="day-of-month">x</div>')
            .append('<div class="year">&nbsp;</div>')
            .addClass('block blank')
            .appendTo('body');
    }
    tally (good, bad);
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

function addMonth (monthNum, percentCompleted) {  
    monthNum = monthNum < 10 ? '0' + parseInt(monthNum) : monthNum;
    var month = moment(monthNum + '/01/' + moment().year());
    var numDaysInMonth = month.daysInMonth();
    var extraZero;
    var daysInMonth = [];

    for (var i=1; i < (numDaysInMonth + 1); i++) {
        if (i < 10) {
            extraZero = '0';
        } else {
            extraZero = '';
        }

        if (!percentCompleted || Math.random() < (percentCompleted / 100)) {
            daysInMonth.push(monthNum + '/' + extraZero + i + '/2014');
        }
    }

    if (!appData) {
        appData = [];
    }

    fb.set(appData.concat(daysInMonth));
}

$('.main-button').click(function (event) {
	event.preventDefault();
	saveDate(moment().format('MM/DD/YYYY'));
});

function clearData () {
	fb.set([]);
}