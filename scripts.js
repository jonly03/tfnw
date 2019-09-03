$(document).ready(function () {

    // Handle clicking on the Calculate button 
    $('#calculate-button').on('click', function (event) {
        // Prevent the form from refreshing the page (its default behavior)
        event.preventDefault();

        // Hide the button because we will update automatically when user enters different inputs
        $('#calculate-button-container').hide();

        updateTimeFronNow()
    })

    var localTimeElement = createLocalTimeElement();

    // Every second, get the current time, update the local time element
    setInterval(function () {
        // Add localTimeElement as a child of #local-time-container 
        // BONUS: why do it here instead of above the setInterval?
        $('#local-time-container').prepend(localTimeElement);

        // Get the current time
        var now = moment();

        // Update #local-time-calculated
        $('#local-time-calculated').text(formatTime({
            time: now
        }))

        // If we've already calculated time from now, update it as well to keep it current
        if ($('#calculated-time-from-now').children().length !== 0) {
            updateTimeFronNow();
        }

    }, 1000);

    function createLocalTimeElement() {
        // Dynamically create local time <p id='local-time-text'></p> element using jQuery
        /*
        Goal: return 
        <p id='local-time-text'>Your local time is: <span id='local-time-calculated' class='calculated-time'></span></p>
        */
        var timeElement = $('<p></p>');
        timeElement.attr('id', 'local-time-text')
        timeElement.html("Your local time is <span id='local-time-calculated' class='calculated-time'></span>")

        return timeElement;
    }

    function createCalculatedTimeFromNowElement() {
        // Uses jQuery to get the value in #input-hours and #input-mins and dynamically create the calculated time from now <p></p> element
        /*
        Goal:
        <p id='calculated-time-from-now-text'>x hours and y mins from now is:
                <span id='time-from-now-calculated' class='calculated-time'>12:50:12</span>
            </p>
        */

        // .val() return strings. So convert them into numbers
        // No need to worry about force casting them to Numbers because our inputs are of type='number'
        var inputHoursValue = Number($('#input-hours').val());
        var inputMinsValue = Number($('#input-mins').val());

        // Use moment to calculate time from now using the hours and mins input values
        var now = moment();

        var elapsedTime = getElapsedYearsAndDays({
            now,
            inputHours: Number(inputHoursValue),
            inputMins: Number(inputMinsValue)
        });

        now.add(inputHoursValue, 'h').add(inputMinsValue, 'm');

        var timeElement = $('<p></p>');
        timeElement.attr('id', 'calculated-time-from-now-text');
        timeElement.html(`${inputHoursValue} hours and ${inputMinsValue} minutes from now is: <span id='time-from-now-calculated' class='calculated-time'>${formatTime({time:now, elapsedYears: elapsedTime.years, elapsedDays: elapsedTime.days})}</span>`)

        return timeElement;
    }

    function getElapsedYearsAndDays({
        now,
        inputHours,
        inputMins
    }) {
        // Account for days and years by checking if the time goes over to the next day
        var elapsedDays = 0;
        var elapsedYears = 0;

        var totalDaysInYear = 365;

        var totalMinsInDay = 1440; // 24 * 60

        var currentHours = now.hour();
        var currentMins = now.minute();

        var totalMinsFromNow = (currentHours + inputHours) * 60 + (currentMins + inputMins);

        if (totalMinsFromNow >= totalMinsInDay) {
            elapsedDays = Math.floor(totalMinsFromNow / totalMinsInDay);

            var potentialElapsedYears = elapsedDays / totalDaysInYear;

            if (potentialElapsedYears > 0) {
                elapsedYears = Math.floor(potentialElapsedYears);
                elapsedDays = elapsedDays % totalDaysInYear;
            }
        }

        return {
            days: elapsedDays,
            years: elapsedYears
        }
    }

    function updateTimeFronNow() {
        var timeFromNowElement = createCalculatedTimeFromNowElement();

        // BONUS: why empty first? Try doing it without it and see what happens
        $('#calculated-time-from-now').empty();

        $('#calculated-time-from-now').prepend(timeFromNowElement);
    }

    function formatTime({
        time,
        elapsedYears,
        elapsedDays
    }) {
        // Formats time in hh:mm:ss format
        var hour = time.hour();
        var min = time.minute();
        var sec = time.second();

        var formattedTime = `${paddTime(hour)}:${paddTime(min)}:${paddTime(sec)}`;

        if ((elapsedYears && elapsedYears > 0) || (elapsedDays && elapsedDays > 0)) {
            formattedTime += ' +';

            if (elapsedYears && elapsedYears > 0) {
                formattedTime += `${elapsedYears} years `;
            }

            if (elapsedDays && elapsedDays > 0) {
                formattedTime += `${elapsedDays} days `;
            }
        }

        return formattedTime.trim();
    }

    function paddTime(number) {
        // number is between:
        // 0-59 for seconds
        // 0-59 for minutes
        // 0-23 for hours
        // appends 0 if number is less than 10
        // leaves number alone if it is greater than 10

        if (number < 10) {
            return `0${number}`;
        } else {
            return `${number}`;
        }
    }
})