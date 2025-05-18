import React from 'react'

const HomePage = () => {
  const handleLogout = async() => {
    localStorage.removeItem("token");
  window.location.href = "/login";
  };

  return (
    <div>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default HomePage