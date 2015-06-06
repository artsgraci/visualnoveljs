/***
 * Function: EventTracker
 *
 * Create object for tracking events
 */
function EventTracker() {

	var eventTracker = null;

	if ( this instanceof EventTracker ) {

		// states
		this.doRepeatEvent = false;
		this.eventsInProgress = [ "main" ];
		this.eventList = {
			"main" : []
		};
		this.eventId = {
			"main" : 0
		};

		this.save = {
			eventsInProgress : [],
			eventId : {}
		};

		eventTracker = this;

	} else {

		eventTracker = new EventTracker();

	}

	return eventTracker;

}

/**
 * Function: addEvent
 *
 * Add event to eventList
 *
 * @param type = wait / nowait
 * @param evt = event to perform
 * @param delay = delay before next event
 */
EventTracker.prototype.addEvent = function addEvent( type, evt, delay ) {

	var eventsInProgress = this.eventsInProgress;
	var currentEvent = eventsInProgress[ eventsInProgress.length - 1 ];

	this.eventList[ currentEvent ].push(
		{
			"type" : type,
			"event" : evt,
			"delay" : delay ? delay : 0
		}
	);

};

/**
 * Function: addNewEventInProgress
 *
 * Add new type of event in list of events that are in progress
 * eventsInProgress = events in progress
 * eventList = stores the events of each event in progress
 *
 * @param eventName = new event to add in eventList, eventsInProgress, & eventId
 */
EventTracker.prototype.addNewEventInProgress = function addNewEventInProgress( eventName ) {

	// store in events in progress
	this.eventsInProgress.push( eventName );

	// create new list for events
	this.eventList[ eventName ] = [];

	// create new event id
	this.eventId[ eventName ] = 0;

};

/**
 * Function: startEvent
 *
 * Perform event in eventList of current event in progress
 * then perform next event if event type = 'nowait'
 */
EventTracker.prototype.startEvent = function startEvent() {

	var self = this;

	// Get event
	var eventsInProgress = this.eventsInProgress;
	var currentEventName = eventsInProgress[ eventsInProgress.length - 1 ];
	var currentEventList = this.eventList[ currentEventName ];
	var currentEventId = this.eventId[ currentEventName ];
	var evt = currentEventList[ currentEventId ];
	var type = evt.type;
	var delay = evt.delay;

	// Debug
	// console.log( "start event: " + currentEventName + " " + currentEventId );
	// console.log( currentEventList );

	// Perform event
	evt.event();

	// Event types: wait / nowait
	// Perform the next event if type:
	//	1. nowait
	this.delayCallback( delay, function() {
		
		if ( type == "nowait" ) {
			self.nextEvent( );
		}

	} );

};

/**
 * Function: nextEvent
 *
 * Perform next event in eventList of
 * events in progress
 */
EventTracker.prototype.nextEvent = function nextEvent( ) {

	var eventsInProgress = this.eventsInProgress;
	var totalEventsInProgress = eventsInProgress.length;
	var currentEvent = eventsInProgress[ totalEventsInProgress - 1 ];
	var evtList = this.eventList[ currentEvent ];
	var eventId = this.eventId;
	eventId[ currentEvent ] += 1;
	var currentEventId = eventId[ currentEvent ];
	
	if ( currentEventId < evtList.length ) {

		this.startEvent( );

	} else {
		
		// Debug
		// console.log( "no more events for: " + currentEvent );

		if ( totalEventsInProgress == 1 ) {

			// Return to main menu
			// this.resetToMainMenu();

			// Changed so user has to reset manually... not sure if good...

		} else {

			// end current event
			eventsInProgress.pop();

			if ( this.doRepeatEvent ) {

				// repeat previous event
				this.doRepeatEvent = false;

				this.startEvent();

			} else {

				// continue from previous event
				this.nextEvent();

			}

		}

	}

};

/**
 * Function: resetEventsInProgress
 *
 * Reset eventsInProgress and eventId
 * eventList is not cleared since the events only get added on page load
 */
EventTracker.prototype.resetEventsInProgress = function resetEventsInProgress() {

	this.eventsInProgress = [ "main" ];
	this.eventId = { "main" : 0	};

};

/**
 * Function: delayCallback
 *
 * Delay the execution of the callback
 *
 * @param delay
 * @param callback
 */
EventTracker.prototype.delayCallback = function delayCallback( delay, callback ) {

	if ( delay ) {

		setTimeout( function() {
			callback();
		}, delay );

	} else {

		callback();

	}

};