export interface UserCreateForm {
    phone: string
    email: string
    password: string
    full_name: string
    address: string
}

export interface Car {
    id: number
    matricule: string
    adresse: string
    genre: string
    nom: string
    inscrit: string
    place: string
    porte: string
    typemoteur: string
    cin: string
    commercial: string
    construteur: string
    dpmc: string
    serie: string
    type: string
    created_at: Date
    updated_at: Date
    user_id: number
    reservations: Reservation[]
}

export interface Reservation {
    id: number
    date: Date
    created_at: Date
    updated_at: Date

    user: User
    user_id: number

    car: Car
    car_id: number

    center: Center
    center_id: number

    payment: Payment
}

export interface User {
    id: number
    full_name: string
    email: string
    role: UserRole
    address: {
        lat: number
        lng: number
    }
    phone: string
    password: string

    notifications: UserNotification[]
    cars: Car[]
    reservations: Reservation[]
    payments: Payment[]
}

export interface UserNotification {
    id: number
    title?: string // optional because @AllowNull(true)
    is_opened: boolean

    user_id: number
    user: User

    created_at: Date
    updated_at: Date
    delete_at?: Date // optional because @AllowNull(true)
}

enum UserRole {
    ADMIN = 0,
    USER = 1,
}

export interface Payment {
    id: number
    amount: number
    status: string
    method?: string // optional since @AllowNull(true)
    created_at: Date
    updated_at: Date

    user: User
    user_id: number

    reservation: Reservation
    reservation_id: number
}

export interface Center {
    id: number
    name: string
    latitude: number
    longitude: number
    availability_start_date: string
    availability_end_date: string
    deleted_at?: Date // optional because @AllowNull(true)
    created_at: Date
    updated_at: Date

    reservations: Reservation[]
}
