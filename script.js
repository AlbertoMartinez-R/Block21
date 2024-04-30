// Wait until the HTML document is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Base URL for the API
    const baseUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-ftb-mt-web-pt/events';

    // Function to fetch parties from the API and display them
    function fetchParties() {
        fetch(baseUrl) // Make a GET request to the server
            .then(response => response.json()) // Convert the response to JSON
            .then(data => {
                if (data.success) {
                    displayParties(data.data); // Display parties if request is successful
                } else {
                    console.error('Failed to fetch parties:', data.error.message); // Log error if not successful
                }
            });
    }

    // Function to display parties on the webpage
    function displayParties(parties) {
        const list = document.getElementById('party-list'); // Get the list element from the HTML
        list.innerHTML = ''; // Clear the list
        parties.forEach(party => {
            const item = document.createElement('li'); // Create a new list item for each party
            item.textContent = `${party.name} - ${party.date} at ${party.location}: ${party.description}`; // Set the text of the list item
            const deleteBtn = document.createElement('button'); // Create a delete button for each party
            deleteBtn.textContent = 'Delete'; // Set the text on the button
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteParty(party.id); // Add a click event to delete the party
            item.appendChild(deleteBtn); // Add the button to the list item
            list.appendChild(item); // Add the list item to the list
        });
    }

    // Listen for the form submission event
    document.getElementById('add-party-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(event.target); // Get the data from the form
        const partyData = { // Prepare the data in the correct format
            name: formData.get('name'),
            date: formData.get('date'),
            location: formData.get('location'),
            description: formData.get('description')
        };
        fetch(baseUrl, { // Send the data to the server to create a new party
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partyData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchParties(); // Refresh the list of parties
                event.target.reset();  // Clear the form fields
            } else {
                console.error('Failed to add party:', data.error.message); // Log error if the request failed
            }
        });
    });

    // Function to delete a party
    function deleteParty(id) {
        fetch(`${baseUrl}/${id}`, { method: 'DELETE' }) // Send a DELETE request to the server
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchParties(); // Refresh the list if the deletion is successful
                } else {
                    console.error('Failed to delete party:', data.error.message); // Log error if the deletion failed
                }
            });
    }

    fetchParties(); // Initial call to fetch and display parties when the page loads
});
