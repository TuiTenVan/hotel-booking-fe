import { parseISO } from "date-fns"
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Table, Button, Tag } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { DateSlider } from './DateSlider'

export const BookingTable = ({ bookingInfo, handleCancelBooking }) => {
    const [filteredBooking, setFilteredBooking] = useState(bookingInfo)

    const filterBookings = (startDate, endDate) => {
        let filtered = bookingInfo
        if (startDate && endDate) {
            filtered = bookingInfo.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkIn)
                const bookingEndDate = parseISO(booking.checkOut)
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                )
            })
        }
        setFilteredBooking(filtered)
    }

    useEffect(() => {
        setFilteredBooking(bookingInfo)
    }, [bookingInfo])

    const columns = [
        {
            title: "Room Type",
            align: "center",
            dataIndex: ["room", "roomType"],
            key: "roomType",
        },
        {
            title: "Check-In",
            dataIndex: "checkIn",
            align: "center",
            key: "checkIn",
            render: (date) => moment(date).format("YYYY-MM-DD"),
        },
        {
            title: "Check-Out",
            align: "center",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (date) => moment(date).format("YYYY-MM-DD"),
        },
        {
            title: "Guest Name",
            align: "center",
            dataIndex: "guestFullName",
            key: "guestFullName",
        },
        {
            title: "Guest Email",
            align: "center",
            dataIndex: "guestEmail",
            key: "guestEmail",
        },
        {
            title: "Adults",
            align: "center",
            dataIndex: "numOfAdults",
            key: "numOfAdults",
        },
        {
            title: "Children",
            align: "center",
            dataIndex: "numOfChildren",
            key: "numOfChildren",
        },
        {
            title: "Total Guests",
            align: "center",
            dataIndex: "totalNumOfGuest",
            key: "totalNumOfGuest",
        },
        {
            title: "Code",
            align: "center",
            dataIndex: "bookingCode",
            key: "bookingCode",
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (status) => {
                let color = "default"
                if (status === "CONFIRMED") color = "green"
                else if (status === "PENDING") color = "orange"
                else if (status === "FAILED") color = "red"
                return <Tag color={color}>{status}</Tag>
            },
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => handleCancelBooking(record.id)}
                />
            ),
        },
    ]

    return (
        <section className="p-4">
            <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
            <Table
                columns={columns}
                dataSource={filteredBooking}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "No Booking Found" }}
                bordered
            />
        </section>
    )
}
