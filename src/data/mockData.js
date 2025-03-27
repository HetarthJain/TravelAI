
// Mock data
export const mockUser = {
  user_id:"1001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Marketing Director",
    avatar: "/avatar.png",
    preferences: {
      airlines: ["Delta", "United"],
      seatingPreference: "Window",
      mealPreference: "Vegetarian",
      hotelChains: ["Marriott", "Hilton"],
    },
    travelHistory: [
      { destination: "New York", date: "Oct 10-15, 2023", purpose: "Conference" },
      { destination: "London", date: "Aug 5-12, 2023", purpose: "Client Meeting" },
      { destination: "Tokyo", date: "May 20-28, 2023", purpose: "Trade Show" },
    ]
  };
  
  export const mockConversations = [
    { 
      id: "1", 
      title: "NYC Conference Trip", 
      date: "Oct 2, 2023",
      messages: [
        { type: "system", content: "Hello! I'm TravelBuddy, your AI travel assistant. How can I help you plan your next business trip?" },
        { type: "user", content: "I need to book a trip to NYC for a conference" },
        { type: "system", content: "I can help you book that trip. What dates are you looking at for the NYC conference?" }
      ]
    },
    { 
      id: "2", 
      title: "San Francisco Visit", 
      date: "Sep 15, 2023",
      messages: [
        { type: "system", content: "Hello! I'm TravelBuddy, your AI travel assistant. How can I help you plan your next business trip?" },
        { type: "user", content: "Need to arrange a visit to our SF office" },
        { type: "system", content: "I'd be happy to help you arrange a visit to your San Francisco office. When are you planning to go?" }
      ]
    },
    { 
      id: "3", 
      title: "Chicago Team Meeting", 
      date: "Aug 27, 2023",
      messages: [
        { type: "system", content: "Hello! I'm TravelBuddy, your AI travel assistant. How can I help you plan your next business trip?" },
        { type: "user", content: "I'm organizing a team meeting in Chicago" },
        { type: "system", content: "I'll help you organize that team meeting in Chicago. How many people will be attending?" }
      ]
    },
  ];
  