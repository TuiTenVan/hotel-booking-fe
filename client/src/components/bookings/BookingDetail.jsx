import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {cancelBooking, getBookingConfirmCode} from "../utils/ApiFunctions"
import moment from "moment"

const BookingDetail = () => {
    const { id } = useParams()
    const [booking, setBooking] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await getBookingConfirmCode(id) // hoặc getBookingById
                setBooking(response)
                console.log("Booking data:", response)
            } catch (err) {
                setError("Không thể tải thông tin đặt phòng.")
            } finally {
                setLoading(false)
            }
        }

        fetchBooking()
    }, [id])

    if (loading) return <div className="text-center mt-5">Đang tải...</div>
    if (error) return <div className="text-danger text-center mt-5">{error}</div>
    if (!booking) return null

    return (
        <div className="container mt-4">
            <h2>Chi tiết đặt phòng</h2>
            <p><strong>Mã xác nhận:</strong> {booking.bookingCode}</p>
            <p><strong>Loại phòng:</strong> {booking.room?.roomType || "N/A"}</p>
            <p><strong>Check-in:</strong> {moment(booking.checkIn).format("YYYY-MM-DD")}</p>
            <p><strong>Check-out:</strong> {moment(booking.checkOut).format("YYYY-MM-DD")}</p>
            <p><strong>Khách hàng:</strong> {booking.guestFullName}</p>
            <p><strong>Email:</strong> {booking.guestEmail}</p>
            <p><strong>Người lớn:</strong> {booking.numOfAdults}</p>
            <p><strong>Trẻ em:</strong> {booking.numOfChildren}</p>
            <p><strong>Tổng khách:</strong> {booking.totalNumOfGuest}</p>
            {booking.status !== "FAILED" && booking.status !== "CANCELED" && (
                <button
                    className="btn btn-danger mt-3"
                    onClick={async () => {
                        try {
                            await cancelBooking(booking.id)
                            alert("Huỷ đặt phòng thành công!")
                            setBooking({ ...booking, status: "FAILED" }) // cập nhật lại status
                        } catch (err) {
                            alert("Không thể huỷ đặt phòng.")
                        }
                    }}
                >
                    Huỷ đặt phòng
                </button>
            )}

        </div>
    )
}

export default BookingDetail;
