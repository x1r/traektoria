// import { Vehicle } from "@/lib/store/store.ts";
import {action, computed, makeObservable, observable} from "mobx";

export interface Vehicle {
    id: number;
    name: string;
    model: string;
    year: number;
    color: string;
    price: number;
    latitude: number;
    longitude: number;
}

export class VehiclesStore {
    vehicles: Vehicle[] = [];

    isLoading: boolean = false;
    sortField: string = "year";
    sortOrder: string = "desc";
    error: string = "";

    constructor() {
        makeObservable(this, {
            vehicles: observable,
            isLoading: observable,
            sortOrder: observable,
            sortField: observable,
            error: observable,
            addVehicle: action.bound,
            updateVehicle: action.bound,
            deleteVehicle: action.bound,
            fetchVehicles: action.bound,
            setVehicles: action.bound,
            setSortField: action.bound,
            setSortOrder: action.bound,
            setError: action.bound,
            setIsLoading: action.bound,
            sortedVehicles: computed,
        });
    }

    get sortedVehicles()  {
        const { vehicles, sortField, sortOrder } = this;

        if (!sortField) return this.vehicles;

        return [...vehicles].sort((a, b) => {
            const aValue = a[sortField as VehicleSortField];
            const bValue = b[sortField as VehicleSortField];

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    addVehicle(vehicle: Vehicle) {
        this.vehicles.push(vehicle);
    }

    updateVehicle(vehicle: Vehicle) {
        const index = this.vehicles.findIndex((v) => v.id === vehicle.id);
        if (index !== -1) {
            this.vehicles[index] = vehicle;
        }
    }

    deleteVehicle(id: number) {
        this.vehicles = this.vehicles.filter((v) => v.id !== id);
    }

    async fetchVehicles() {
        this.isLoading = true;
        try {
            const response = await fetch(
                "https://ofc-test-01.tspb.su/test-task/vehicles"
            );
            const data: Vehicle[] = await response.json();

            this.setVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        } finally {
            this.setIsLoading(false);
        }
    }

    setVehicles(vehicles: Vehicle[]) {
        this.vehicles = vehicles;
    }

    setSortField(field: string) {
        this.sortField = field;
    }

    setSortOrder(order: string) {
        this.sortOrder = order;
    }

    setError(error: string) {
        this.error = error;
    }

    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}

export const store = new VehiclesStore();
export type VehicleSortField = keyof Vehicle;