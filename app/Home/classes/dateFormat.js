export const formatTimestampToDate = (timestamp) => {
    const timestamps = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
  
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  
    const formattedDate = dateTimeFormat.format(timestamps);
    return formattedDate; // Adjust date format as needed
  };
  export const formatCreatedAt = (timestamp) => {
    const date = new Date(timestamp.toDate()); // Convert Firestore timestamp to JavaScript Date object
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const day = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0"); // Ensure two-digit format
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two-digit format
    return `${day} ${hours}:${minutes}`;
  };