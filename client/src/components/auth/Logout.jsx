import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

export const Logout = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const userRole = localStorage.getItem("userRole")

  const handleLogout = () => {
    auth.handleLogout()
    navigate("/", { state: { message: "You have been logged out!" } })
  }

    return (
        <>
            <li>
                <Link className="dropdown-item" to={"/profile"}>
                    Profile
                </Link>
            </li>

            {userRole !== "ROLE_ADMIN" && (
                <>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <Link className="dropdown-item" to={"/booking-history"}>
                            Booking History
                        </Link>
                    </li>
                </>
            )}

            <li><hr className="dropdown-divider" /></li>
            <button className="dropdown-item" onClick={handleLogout}>
                Logout
            </button>
        </>
    )
}