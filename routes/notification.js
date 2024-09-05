const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationmodel'); // Adjust the path as necessary

// POST route to create a new notification
router.post('/notifications', async (req, res) => {
    try {
        const { comment } = req.body;

        // Validate input
        if (!comment) {
            return res.status(400).json({ message: 'Comment is required' });
        }

        // Create a new notification
        const newNotification = new Notification({
            comment
        });

        // Save the notification to the database
        await newNotification.save();

        // Respond with the created notification
        res.status(201).json(newNotification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to fetch the latest 3 notifications
router.get('/notifications', async (req, res) => {
    try {
        // Fetch the latest 3 notifications
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(3);

        // Respond with the notifications
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
