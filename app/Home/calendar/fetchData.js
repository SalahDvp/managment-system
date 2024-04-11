
import { collection, getDocs, query, where, getFirestore, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase';
export  const fetchFirestoreData = async () => {

    const classesQuery = query(collection(db, 'Classes'));
    const classesSnapshot = await getDocs(classesQuery);
    const classesData = classesSnapshot.docs.map(doc => ({
        classId: doc.id,
        className: doc.data().className,
    }));
    
    const eventsPromises = classesData.map(async classData => {
        const attendanceQuery = query(collection(db, `Classes/${classData.classId}/attendance`));
        const attendanceSnapshot = await getDocs(attendanceQuery);

        const attendanceData = attendanceSnapshot.docs.map(doc => ({
            attendanceId: doc.id,
            ...doc.data()
            // Include other data you need from the attendance document
        }));

        return attendanceData.map(attendance => ({
            title: classData.className,
            start: new Date(attendance.date.toDate()), // Assuming start is a Firestore timestamp
            end:new Date(new Date(attendance.date.toDate()).getTime() + 2 * 60 * 60 * 1000) , // Assuming end is a Firestore timestamp
            type: 'class',
            classId: classData.classId,
            attendanceId: attendance.attendanceId,
            resource: parseInt(attendance.court.match(/\d+/)[0]),
            color:"#FFC0CB"
        }));
    });
    
    const allClasses = (await Promise.all(eventsPromises)).flat();

    // Fetch tournament data and construct events
    const tournamentsQuery = query(collection(db, 'Competitions'));
    const tournamentsSnapshot = await getDocs(tournamentsQuery);
    const tournamentsEvents = tournamentsSnapshot.docs.map(doc => ({
        title: doc.data().type,
        start: new Date(doc.data().date.toDate()), // Assuming start is a Firestore timestamp
        end: new Date(doc.data().end.toDate()), // Assuming end is a Firestore timestamp
        type: 'tournament',
        tournamentsId:doc.id,
        resource:parseInt(doc.data().court.match(/\d+/)[0]),
        color:"#ADD8E6 "
    }));

    // Fetch court reservations data and construct events

    const courtsWithReservations = [];
 // Fetch court reservations data
  const courtsQuery = query(collection(db, 'Courts'));
  const courtsSnapshot = await getDocs(courtsQuery);
  const courtsData = courtsSnapshot.docs.map(doc => doc.data());

  // Assuming each court has a subcollection "Reservations"
  
  for (const courtDoc of courtsData) {
    const reservationsQuery = query(collection(db, `Courts/${courtDoc.name}/Reservations`));
    const reservationsSnapshot = await getDocs(reservationsQuery);
    const reservationsData = reservationsSnapshot.docs
    .filter(doc => doc.data().type === undefined) // Filter out documents without the 'type' field
    .map(doc => ({
      title:"Court Booking",
      start: new Date(doc.data().startTime.toDate()),
      end: new Date(doc.data().endTime.toDate()),
      type: 'match',
      matchId: doc.id,
      courtName: doc.data().courtName,
      resource:parseInt(doc.data().courtName.match(/\d+/)[0]),
      color:"#90EE90"

    }));

    // Merge reservationsData into courtsWithReservations
    courtsWithReservations.push(...reservationsData);
}
    // Merge all events  s,
    const allEvents = [...tournamentsEvents,...courtsWithReservations,...allClasses]

    return { classes: allClasses,tournaments: tournamentsEvents,  allEvents: allEvents,courts: courtsWithReservations };
};