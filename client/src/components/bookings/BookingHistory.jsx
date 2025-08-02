import React, { useEffect, useState } from "react"
import { Table, Tag, Button, message } from "antd"
import { EyeOutlined } from "@ant-design/icons"
import moment from "moment"
import { getBookingsByUserId } from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"

const BookingHistory = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true)
            try {
                const response = await getBookingsByUserId(userId, token)
                setBookings(response)
            } catch (error) {
                console.error("Error fetching bookings:", error.message)
                setErrorMessage("Failed to load booking history.")
                message.error("Could not load booking data.")
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [userId])

    const handleViewBooking = (id) => {
        navigate(`/booking/${id}`)
    }

    const columns = [
        {
            title: "No.",
            align: "center",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Room Type",
            align: "center",
            dataIndex: ["room", "roomType"],
            key: "roomType"
        },
        {
            title: "Check-In",
            align: "center",
            dataIndex: "checkIn",
            key: "checkIn",
            render: (date) => moment(date).format("YYYY-MM-DD")
        },
        {
            title: "Check-Out",
            align: "center",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (date) => moment(date).format("YYYY-MM-DD")
        },
        {
            title: "Code",
            align: "center",
            dataIndex: "bookingCode",
            key: "bookingCode"
        },
        {
            title: "Status",
            align: "center",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = ""
                switch (status) {
                    case "CONFIRMED":
                        color = "green"
                        break
                    case "PENDING":
                        color = "orange"
                        break
                    case "FAILED":
                        color = "red"
                        break
                    default:
                        color = "gray"
                }
                return <Tag color={color}>{status}</Tag>
            }
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewBooking(record.id)}
                />
            )
        }
    ]

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Booking History</h2>
            <Table
                columns={columns}
                dataSource={bookings}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    )
}

export default BookingHistory
