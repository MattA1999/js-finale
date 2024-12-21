const express = require('express')
const path = require('path')
const routes = require('./routes/index')
const { getCollection, ObjectId } = require('./dbconnect')

const app = express()
const PORT = 3000

//parse JSON requests
app.use(express.json())

//serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')))

//routes for menu and event collections
app.use('/api/v1', routes)

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.get('/admin', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'admin.html'))
})

// New route for full event details page
app.get('/event/:eventId', async (request, response) => {
    const eventId = request.params.eventId // Get eventId from the URL parameter

    try {
        const eventsCollection = await getCollection('food_truck_db', 'event_list')

        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) })  // Find event by its _id

        if (!event) {
            return response.status(404).send('Event not found')
        }

       //send event details as json
        response.json(event)
    } catch (error) {
        console.error("Error fetching event:", error)
        response.status(500).send('Internal Server Error')
    }
})

//post route for menu
app.post('/api/v1/menu', async (request, response) => {
    try {
        const menuCollection = await getCollection('food_truck_db', 'menu_items')
        const result = await menuCollection.insertOne(request.body) // Insert the menu item
        response.status(201).json(result.ops[0]) // Respond with the inserted item
    } catch (err) {
        response.status(500).send(err.message)
    }
})

//post route for events
app.post('/api/v1/events', async (request, response) => {
    const { name, location, date, time } = request.body
    
    // Log incoming data to make sure it's correct
    console.log('Received event data:', request.body)

    // Check if any required field is missing
    if (!name || !location || !date || !time) {
        return response.status(400).json({ error: 'All fields are required' })
    }

    try {
        const newEvent = new Event({ name, location, date, time })
        await newEvent.save()
        response.status(201).json(newEvent)
    } catch (error) {
        console.error('Error creating event:', error)
        response.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(PORT, () => {

    console.log(`server is running at http://localhost:${PORT}`)
})