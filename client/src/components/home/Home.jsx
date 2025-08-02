import React, {useEffect, useState} from 'react'
import { Header } from '../layout/Header'
import { HotelService } from '../common/HotelService'
import { Parallax } from '../common/Parallax'
import { RoomCarousel } from '../common/RoomCarousel'
import { RoomSearch } from '../room/RoomSearch'
import { useLocation } from 'react-router-dom'

export const Home = () => {
  const location = useLocation();
  const [showLoggedInMessage, setShowLoggedInMessage] = useState(true)
  const message = location.state && location.state.message
  const currentUser = localStorage.getItem("userId")

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoggedInMessage(false)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    return (
    <section>
      {message && <p className='text-warning text-center'>{message}</p>}
        {currentUser && showLoggedInMessage && (
            <h6 className='text-success text-center'>
                You are logged in as {currentUser}
            </h6>
        )}
        <Header/>
        <section className='container'>
        <RoomSearch/>
        <RoomCarousel/>
        <Parallax/>
        <HotelService/>
        </section>
    </section>
  )
}