import React, { useState, createContext, useContext, ReactNode, useEffect } from "react"

type FiltersType = {
    status: string[]
    type: string[]
    cities: string[]
    /* plotArea: number[] */
}

interface AppContextType {
    applyFilters: (appliedFilters: object) => void
    clearFilters: () => void
    filters: FiltersType | null
    /*  favoriteProperties: string[]
    addToFavorites: (project_name: string) => void
    removeFromFavorites: (project_name: string) => void */
}

const AppContext = createContext<AppContextType | undefined>({
    applyFilters: () => {},
    clearFilters: () => {},
    filters: {
        status: [],
        type: [],
        cities: [],
        /*  plotArea: [], */
    },
    /*  favoriteProperties: [],
    addToFavorites: () => {},
    removeFromFavorites: () => {}, */
})

interface AppProviderProps {
    children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [filters, setFilters] = useState<FiltersType>({
        status: [],
        type: [],
        cities: [],
        /* plotArea: [], */
    })
    /*     const [favoriteProperties, setFavoriteProperties] = useState<string[]>([])
     */
    const applyFilters = (appliedFilters: object) => {
        const updatedFilters = { ...filters, ...appliedFilters }

        for (const key in updatedFilters) {
            if (key === "type" || key === "cities" /* || key === "plotArea" */ || key === "status") {
                if (updatedFilters[key] === null || updatedFilters[key] === undefined) {
                    delete updatedFilters[key]
                }
            }
        }
        setFilters(updatedFilters)
    }

    const clearFilters = () => {
        setFilters({
            status: [],
            type: [],
            cities: [],
            /* plotArea: [], */
        })
    }

    /* const addToFavorites = (project_name: string) => {
        if (!favoriteProperties.includes(project_name)) {
            setFavoriteProperties((prevFavorites) => [...prevFavorites, project_name])
        }
    }

    const removeFromFavorites = (project_name: string) => {
        setFavoriteProperties((prevFavorites) => prevFavorites.filter((elem) => elem !== project_name))
    } */

    const contextValue: AppContextType = {
        filters,
        /* favoriteProperties */
        applyFilters,
        clearFilters,
        /*  addToFavorites,
        removeFromFavorites, */
    }

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

const useAppProvider = (): AppContextType => {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useAppProvider must be used within an AppProvider")
    }

    return context
}

export { AppProvider, useAppProvider }
