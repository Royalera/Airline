public with sharing class FlightSearchControler {
    @AuraEnabled(cacheable=true)
    public static List<Airlines_Name__c> searchFlights(String departureCity, String arrivalCity, Date departureDate) {
        return [
            SELECT Id, Name, City_From__c, City_To__c, Departure_Date__c, Price__c
            FROM Airlines_Name__c
            WHERE City_From__c = :departureCity
                AND City_To__c = :arrivalCity
                AND Departure_Date__c = :departureDate
        ];
    }
    @AuraEnabled
    public static void createBooking(String flightId, String name, String email, String phone, String departure, String arrival, Date departureDate, Decimal price) {
        Booking__c booking = new Booking__c();
        booking.Airlines_Name__c = flightId;
        booking.Name = name;
        booking.Email__c = email;
        booking.Phone_No__c = phone;
        booking.City_From__c = departure;
        booking.City_To__c = arrival;
        booking.Departure_Date__c = departureDate;
        booking.Price__c = price;
        try {
            
            insert booking;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}