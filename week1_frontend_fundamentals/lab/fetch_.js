fetch('https://api.example.com/countries')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }
    )
    .then(data => {
        console.log('Countries:', data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

// Example of using fetch with async/await
async function fetchCountries() {
    try {
        const response = await fetch('https://api.example.com/countries');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Countries:', data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}