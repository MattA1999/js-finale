const express = require('express')
const { getCollection, ObjectId } = require('../dbconnect')
const router = express.Router()


const getMenuCollection = async () => await getCollection('food_truck_db', 'menu_items')
const getEventsCollection = async () => await getCollection('food_truck_db', 'event_list')


//menu routes
router.get('/menu', async (request, response) => {
    try {
        const menuCollection = await getMenuCollection()
        const menu = await menuCollection.find().toArray()
        response.json(menu)
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post('/menu', async (request, response) => {
    try {
        const menuCollection = await getMenuCollection()
        const result = await menuCollection.insertOne(request.body)
        response.status(201).json(result.ops[0])
    } catch (err) {
        response.status(500).send(err.message)
    }
})

//event routes
router.get('/events', async (request, response) => {
    try {
        console.log('request body recieved', request.body)
        const eventsCollection = await getEventsCollection()
        const events = await eventsCollection.find().toArray()
        response.json(events)
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post('/events', async (request, response) => {
    try {
        console.log('Received event data:', request.body) // Log the incoming data

        const eventsCollection = await getEventsCollection()
        const result = await eventsCollection.insertOne(request.body)
        console.log('Insert result:', result)
        response.status(201).json(result.ops[0])
    } catch (err) {
        console.error('Error processing event data:', err) // Log the error
        response.status(500).send('Internal Server Error')
    }
})
module.exports = router

