import { mockUser } from "../data/mockData"

const Profile = ({setShowProfile})=>{
    return (
        <>
         <div className="profile-section">
            <div className="profile-header">
              <h2>Employee Profile</h2>
              <button
                variant="ghost"
                onClick={() => setShowProfile(false)}
                className="close-profile"
              >
                ×
              </button>
            </div>

            <div className="profile-info">
              <div className="profile-basics">
                <div className="profile-avatar">
                  <img src={mockUser.avatar} alt={mockUser.name} />
                </div>
                <div>
                  <h3>{mockUser.name}</h3>
                  <p>{mockUser.email}</p>
                  <p><strong>Role:</strong> {mockUser.role}</p>
                </div>
              </div>

              {/* <Separator className="profile-separator" /> */}

              <div className="profile-section">
                <h4>Travel Preferences</h4>
                <div className="preferences-grid">
                  <div className="preference-item">
                    <strong>Preferred Airlines:</strong>
                    <p>{mockUser.preferences.airlines.join(", ")}</p>
                  </div>
                  <div className="preference-item">
                    <strong>Seating Preference:</strong>
                    <p>{mockUser.preferences.seatingPreference}</p>
                  </div>
                  <div className="preference-item">
                    <strong>Meal Preference:</strong>
                    <p>{mockUser.preferences.mealPreference}</p>
                  </div>
                  <div className="preference-item">
                    <strong>Hotel Chains:</strong>
                    <p>{mockUser.preferences.hotelChains.join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* <Separator className="profile-separator" /> */}

              <div className="profile-section">
                <h4>Travel History</h4>
                <div className="travel-history">
                  {mockUser.travelHistory.map((trip, index) => (
                    <div key={index} className="travel-history-item">
                      <div className="travel-icon">
                        <img src={null} alt="icon_alt"></img>
                      </div>
                      <div className="travel-details">
                        <p className="travel-destination">{trip.destination}</p>
                        <p className="travel-date">{trip.date}</p>
                        <p className="travel-purpose">{trip.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
    )
}
export default Profile;