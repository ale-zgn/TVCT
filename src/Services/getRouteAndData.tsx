import { useGetUserAppointmentsQuery } from "./API"

export const getRouteAndData = (item: any | any) => {
    let route = ""
    let data = {}
    const { data: appointments } = useGetUserAppointmentsQuery({})

    switch (item.location) {
        case "Ticket":
            route = "TicketDetails"
            data = {
                id: item.location_id,
            }
            break
        case "Appointment":
            const appointment = appointments?.find((appointment) => appointment.id === item.location_id)
            route = "AppointmentsDetails"
            data = {
                appointment: appointment,
            }
            break
        case "Warranty":
            route = "Warranty"
            data = {}
            break
        default:
            break
    }

    return { route, data }
}
