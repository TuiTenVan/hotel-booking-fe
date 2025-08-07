import {parseISO} from "date-fns"
import React, {useEffect, useState} from 'react'
import moment from 'moment'
import {Button, Table, Tag} from "antd"
import {CloseCircleOutlined} from "@ant-design/icons"
import {DateSlider} from './DateSlider'

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
        const sorted = [...bookingInfo].sort((a, b) => {
            const dateA = new Date(
                a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2],
                a.createdAt[3], a.createdAt[4], a.createdAt[5]
            )
            const dateB = new Date(
                b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2],
                b.createdAt[3], b.createdAt[4], b.createdAt[5]
            )
            return dateB - dateA // giảm dần (mới nhất trước)
        })
        setFilteredBooking(sorted)
    }, [bookingInfo])


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
            key: "roomType",
        },
        {
            title: "Created At",
            align: "center",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (dateArr) => {
                if (!Array.isArray(dateArr) || dateArr.length < 6) return "Invalid date"

                const [year, month, day, hour, minute, second] = dateArr
                const jsDate = new Date(year, month - 1, day, hour, minute, second)
                return moment(jsDate).format("YYYY-MM-DD HH:mm:ss")
            }
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
                let color = "magenta"
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
                    icon={<CloseCircleOutlined  />}
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
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: "No Booking Found" }}
                bordered
            />
        </section>
    )
}
