const { admin, db } = require('../config/firebase');

const { validationResult } = require('express-validator');

exports.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const userId = req.user.userId; // Using userId from req.user
    console.log(`[TASK] Create task attempt by: ${userId}`);

    try {
        const taskRef = db.collection('tasks').doc();
        const newTask = {
            userId,
            title,
            description: description || '',
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await taskRef.set(newTask);
        res.status(201).json({ id: taskRef.id, ...newTask });
    } catch (error) {
        next(error);
    }
};

exports.getTasks = async (req, res, next) => {
    const userId = req.user.userId;
    console.log(`[TASK] Fetching tasks for: ${userId}`);

    try {
        const snapshot = await db.collection('tasks').where('userId', '==', userId).get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    try {
        const taskRef = db.collection('tasks').doc(id);
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (doc.data().userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;

        await taskRef.update(updateData);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const taskRef = db.collection('tasks').doc(id);
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (doc.data().userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }

        await taskRef.delete();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};
