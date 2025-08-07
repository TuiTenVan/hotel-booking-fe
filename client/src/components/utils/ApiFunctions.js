import axios from 'axios'

export const api = axios.create({
    baseURL: "http://localhost:8088"
})

export const getHeader = () => {
    const token = localStorage.getItem("token")
    console.log("Token:", token)
    return {
        Authorization: `Bearer ${token}`,
    }
}

/** This function add new room */
export async function addNewRoom(image, roomRequest) {
    const formData = new FormData();
    formData.append("image", image);

    const jsonBlob = new Blob([JSON.stringify(roomRequest)], {
        type: "application/json",
    });
    formData.append("room", jsonBlob);

    const res = await api.post("/api/rooms/addNewRoom", formData, {
        headers: getHeader(),
    });

    return res.status === 201 || res.status === 200;
}

/** This function update room */
export async function updateRoom(roomId, image, roomRequest) {
    const formData = new FormData();
    if (image) {
        formData.append("image", image);
    }

    const cleanedRequest = Object.fromEntries(
        Object.entries(roomRequest).filter(([_, v]) => v !== undefined)
    );

    const jsonBlob = new Blob([JSON.stringify(cleanedRequest)], {
        type: "application/json",
    });
    formData.append("room", jsonBlob);

    const res = await api.put(`/api/rooms/update/${roomId}`, formData, {
        headers: getHeader(),
    });

    return res;
}


/** This function get rooms by type */
export async function getRoomType() {
    try {
        const res = await api.get("/api/rooms/roomTypes")
        return res.data
    } catch (error) {
        throw new Error("Error Fetching Room Types")
    }
}

export async function getExtraService() {
    try {
        const res = await api.get("/api/extras")
        return res.data
    } catch (error) {
        throw new Error("Error Fetching Room Types")
    }
}

/** This function get all rooms*/
export async function getAllRooms() {
    try {
        const res = await api.get("/api/rooms/allRooms")
        return res.data
    } catch (error) {
        throw new Error("Error fetching rooms")
    }
}

/** This function delete room by id*/
export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/api/rooms/delete/room/${roomId}`, {
            headers: getHeader()
        })
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}

/** This function get room By Id*/
export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/api/rooms/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error fetching room ${error.message}`)
    }
}

/** This function Booking Room*/
export async function bookRoom(roomId, booking) {
    try {
        const response = await api.post(`/api/bookings/room/${roomId}/booking`, booking)
        return response.data
    } catch (error) {
        console.log("Error booking room:", error)
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`Error booking room ${error.message}`)
        }
    }
}

/** This function Get All Booking Room*/
export async function getAllBookings() {
    try {
        const result = await api.get("/api/bookings/all-bookings")
        return result.data
    } catch (error) {
        throw new Error(`Error fetching bookings ${error.message}`)
    }
}

/** This function Get Booking Room Confirm Code*/
export async function getBookingConfirmCode(id) {
    try {
        const response = await api.get(`/api/bookings/${id}`)
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`Error find booking ${error.message}`)
        }
    }
}

/** This function Cancel Booking Room */
export async function cancelBooking(bookingId) {
    try {
        const result = await api.delete(`/api/bookings/${bookingId}/delete`)
        return result.data
    } catch (error) {
        throw new Error(`Error canceling booking ${error.message}`)
    }
}

/** This function get Available Rooms */
export async function getAvailableRooms(checkIn, checkOut, roomType) {
    const result = await api.get(`/api/rooms/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${roomType}`)
    return result
}

/** This function register user */
export async function signUp(dataReq) {
    try {
        const response = await api.post('/api/auth/register', dataReq)
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`Error ${error.message}`)
        }
    }
}

/** This function login user */
export async function signIn(login) {
    try {
        const response = await api.post('/api/auth/login', login)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

/** This function get User Profile */
export async function getUserProfile(userId, token) {
    try {
        const response = await api.get(`/api/users/profile/${userId}`, {
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function deleteUser(userId){
    try {
        const response = await api.delete(`/api/user/delete/${userId}`,{
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        return error.message
    }
}

export async function getUser(userId, token) {
    try {
        const response = await api.get(`/api/users/${userId}`, {
            headers: getHeader()
        })
        return response.data
    } catch (error) {
        throw error
    }
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/api/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}