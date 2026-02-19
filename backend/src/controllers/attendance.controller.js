const { admin, db } = require('../config/firebase');

exports.checkIn = async (req, res, next) => {
    const userEmail = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    console.log(`[ATTENDANCE] Check-in attempt for: ${userEmail} on ${today}`);

    try {
        const attendanceQuery = await db.collection('attendance')
            .where('userEmail', '==', userEmail)
            .where('date', '==', today)
            .get();

        let attendanceDoc;
        let attendanceRef;

        if (attendanceQuery.empty) {
            attendanceRef = db.collection('attendance').doc();
            attendanceDoc = {
                userEmail,
                date: today,
                checkIns: [],
                createdAt: new Date()
            };
        } else {
            attendanceRef = attendanceQuery.docs[0].ref;
            attendanceDoc = attendanceQuery.docs[0].data();
        }

        // Prevent duplicate open session
        const lastCheckIn = attendanceDoc.checkIns[attendanceDoc.checkIns.length - 1];
        if (lastCheckIn && lastCheckIn.checkOutTime === null) {
            return res.status(400).json({ message: 'You already have an open check-in session' });
        }

        const newCheckIn = {
            checkInTime: new Date(),
            checkOutTime: null
        };

        if (attendanceQuery.empty) {
            attendanceDoc.checkIns.push(newCheckIn);
            await attendanceRef.set(attendanceDoc);
        } else {
            await attendanceRef.update({
                checkIns: admin.firestore.FieldValue.arrayUnion(newCheckIn)
            });
        }

        res.status(201).json({ message: 'Checked in successfully' });
    } catch (error) {
        next(error);
    }
};

exports.checkOut = async (req, res, next) => {
    const userEmail = req.user.userId;
    const today = new Date().toISOString().split('T')[0];
    console.log(`[ATTENDANCE] Check-out attempt for: ${userEmail} on ${today}`);

    try {
        const attendanceQuery = await db.collection('attendance')
            .where('userEmail', '==', userEmail)
            .where('date', '==', today)
            .get();

        if (attendanceQuery.empty) {
            return res.status(400).json({ message: 'No attendance record found for today' });
        }

        const attendanceDoc = attendanceQuery.docs[0].data();
        const attendanceRef = attendanceQuery.docs[0].ref;
        const checkIns = attendanceDoc.checkIns;

        const lastCheckInIndex = checkIns.length - 1;
        if (lastCheckInIndex < 0 || checkIns[lastCheckInIndex].checkOutTime !== null) {
            return res.status(400).json({ message: 'No active check-in session found' });
        }

        checkIns[lastCheckInIndex].checkOutTime = new Date();

        await attendanceRef.update({ checkIns });

        res.json({ message: 'Checked out successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getMyAttendance = async (req, res, next) => {
    const userEmail = req.user.userId;

    try {
        const snapshot = await db.collection('attendance')
            .where('userEmail', '==', userEmail)
            .get();

        const attendance = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.date.localeCompare(a.date));

        res.json(attendance);
    } catch (error) {
        next(error);
    }
};
