// Fetch cordinates based on user Input
function getCordinates(location, callback) {


    const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=${location}&accept-language=en&polygon_threshold=0.0`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b5a9039af8mshf35a3ef3045004ep1efb1cjsndf46ef774554',
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
    };
    
    fetch(url, options)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            let cordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            callback(cordinates)
        })
}

// Fetch hotel based on cordinates retrieved from "getCordinates()"
function getHotel() {
    getCordinates("London", function(cordinates) {
        console.log("lat: " + cordinates.lat + " and long: " + cordinates.lon );

        let lat = cordinates.lat
        let lon = cordinates.lon

        // Define the base URL
        const baseUrl = 'https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates';

        // Define query parameters as an object
        const queryParams = {
            locale: 'en-gb',
            room_number: 1,
            checkin_date: '2024-05-19',
            checkout_date: '2024-05-20',
            filter_by_currency: 'GBP',
            longitude: lon,
            latitude: lat,
            adults_number: 2,
            order_by: 'popularity',
            units: 'metric',
            page_number: 0,
            children_number: 2,
            include_adjacency: true,
            children_ages: '5,0',
            categories_filter_ids: 'class::2,class::4,free_cancellation::1'
        };

        // Create an array of query parameter strings
        const queryParamStrings = Object.keys(queryParams).map(key => `${key}=${encodeURIComponent(queryParams[key])}`);

        // Combine the base URL and query parameters
        const url = `${baseUrl}?${queryParamStrings.join('&')}`;

        // Use the 'url' variable for your API request
        console.log(url);

        const options = {
	        method: 'GET',
	        headers: {
		        'X-RapidAPI-Key': '',
		        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
	        }
        };

        // fetch api to retrieve a data
        fetch(url, options)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {

                // pass to processHotels data.result as that's where all data is we need
                let processedHotels = processHotels(data.result)
                console.log(processedHotels)

            })
            .catch(function(error) {
                console.error("Error message: " + error);
            })
    })
}

function getHotelDetails(hotelId) {

}
// Function to extract specific data for each hotel from the api response
function processHotels(hotelsData) {
    return hotelsData.map(function(hotel) {
        return {
            hotelId: hotel.hotel_id,
            hotelLat: hotel.latitude,
            hotelLon: hotel.longitude,
            hotelName: hotel.hotel_name,
            reviewScore: hotel.review_score,
            reviewScoreWord: hotel.review_score_word,
            hotelPhoto: hotel.max_photo_url,
            hotelAddressRoad: hotel.address,
            hotelAddressPostal: hotel.zip,
            hotelCheckIn: hotel.checkin.from,
            hotelCheckOut: hotel.checkout.until,
            hotelNightPrice: hotel.min_total_price,
            bookingComLink: hotel.url,
        }
    })
}

// getHotel();