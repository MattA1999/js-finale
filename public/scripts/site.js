


//get menu items and display on page
const loadMenu = async () => {

    try {
        const response = await fetch('/api/v1/menu') //fetch any newely added menu items
        const menu = await response.json()
        
        const menuList = document.getElementById('menu-list')

        console.log('Menu JSON:', menu)

        menuList.innerHTML = menu.map(item => `
            <li>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Price: $${item.price}</p>
                <img src="${item.image}" alt="${item.name}"
            </li>
        `).join('')
    } catch (error) {
        console.error("Error loading menu:", error)
    }
}


// get events and display on  page (id name date)
const loadEventsOverview = async () => {
    try {
        const response = await fetch('/api/v1/events')
        const events = await response.json()

        const eventsOverview = document.getElementById('events-overview')
        eventsOverview.innerHTML = events.map(event => `
            <div>
                <h3><a href="/event/${event._id}">${event.name}</a></h3>
                <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            </div>
        `).join('')
    } catch (error) {
        console.error("Error loading events:", error)
    }
}

//get data after page has been loaded
console.log('script loaded')

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed')
    loadMenu()
    loadEventsOverview()
})

//handle POST request to add menu items and events

if (window.location.pathname === '/admin') {
    // Menu form submission handler
    document.getElementById('menu-form').addEventListener('submit', async (event) => {
        event.preventDefault()
    
        // Get the form data including the image file
        const formData = new FormData()
        formData.append('name', document.getElementById('name').value)
        formData.append('description', document.getElementById('description').value)
        formData.append('price', document.getElementById('price').value)
        formData.append('image', document.getElementById('image').files[0]) // Append image file
    
        // Send the data using a POST request
        try{
            await fetch('/api/v1/menu', {
                method: 'POST',
                body: formData,  // Send form data including the image file
            })
            //clear menu form after submission
            document.getElementById('menu-form').reset()

            //pop up if menu input successfui
            alert('Event successfully entered!')
        }catch{
            console.error('Error submitting menu item:', error)
        }
        
    })   

    document.getElementById('event-form').addEventListener('submit', async (event) => {
        event.preventDefault()
    
        const newEvent = {
            name: document.getElementById('event-name').value,
            location: document.getElementById('event-location').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value
        }
    
        //make sure data is inputted correctly
        console.log('Submitting event data', newEvent)

        try{
            await fetch('/api/v1/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            })
            
            //clear form when submit button is clicked
            document.getElementById('event-form').reset()

            //pop up when event is successfully entered
            alert('Event successfully entered!')

        }catch(error){
            console.error('Error submitting event:', error)
        }
        

        //display popup confirming entry
        
    })
}

