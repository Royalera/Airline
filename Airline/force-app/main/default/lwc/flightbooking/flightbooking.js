import { LightningElement, track } from 'lwc';
import searchFlights from '@salesforce/apex/FlightSearchControler.searchFlights';
import createBooking from '@salesforce/apex/FlightSearchControler.createBooking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Flightbooking extends LightningElement {
    departureCity;
    arrivalCity;
    departureDate;

    @track flights = [];
    @track selectedFlight;
    showFlights = false;
    showModal = false;

    @track name = '';
    @track email = '';
    @track phone = '';

    handleDepartureAirportChange(event) {
        this.departureCity = event.target.value;
    }
    handleArrivalAirportChange(event) {
        this.arrivalCity = event.target.value;
    }
    handleDepartureDateAirportChange(event) {
        this.departureDate = event.target.value;
    }

    handleSearchFlights() {
        if (!this.departureCity || !this.arrivalCity) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Missing Info',
                message: 'Please enter both departure and arrival cities.',
                variant: 'warning'
            }));
            return;
        }

        searchFlights({
            departureCity: this.departureCity,
            arrivalCity: this.arrivalCity,
            departureDate: this.departureDate
        })
        .then(result => {
            this.flights = result;
            this.showFlights = this.flights.length > 0;
            if (!this.showFlights) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'No Flights',
                    message: 'No flights found for the selected route/date.',
                    variant: 'info'
                }));
            }
        })
        .catch(error => {
            console.error('Error searching flights:', error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Unable to fetch flights. Please try again.',
                variant: 'error'
            }));
        });
    }

    handleBookFlight(event) {
        const flightId = event.currentTarget.dataset.flightId;
        this.selectedFlight = this.flights.find(f => f.Id === flightId);
        this.name = '';
        this.email = '';
        this.phone = '';
        this.showModal = true;
    }

    handleNameChange(event) { this.name = event.target.value; }
    handleEmailChange(event) { this.email = event.target.value; }
    handlePhoneChange(event) { this.phone = event.target.value; }

    confirmBooking() {
        if (!this.selectedFlight || !this.name || !this.email || !this.phone) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Missing Information',
                message: 'Please fill all required fields.',
                variant: 'warning'
            }));
            return;
        }

        createBooking({
            flightId: this.selectedFlight.Id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            departure: this.selectedFlight.City_From__c,
            arrival: this.selectedFlight.City_To__c,
            departureDate: this.selectedFlight.Departure_Date__c,
            price: this.selectedFlight.Price__c
        })
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your flight has been booked successfully!',
                variant: 'success'
            }));
            this.showModal = false;
        })
        .catch(error => {
            console.error('Booking error:', error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Booking failed. Please try again.',
                variant: 'error'
            }));
        });
    }

    closeModal() {
        this.showModal = false;
    }
}
