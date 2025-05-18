import React from 'react'

const HomePage = () => {
  const handleLogout = async() => {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error("Failed to logout");
    }
    console.log("Logout successful:", result);
    alert("Logout successful!");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <div>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default HomePage