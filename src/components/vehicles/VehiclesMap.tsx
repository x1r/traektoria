import React, {useLayoutEffect} from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {store, Vehicle} from "@/lib/store/store";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import "leaflet/dist/leaflet.css";
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import L from "leaflet";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


interface VehiclesMapProps {
    onVehicleClick?: (vehicle: Vehicle) => void;
}

export const VehiclesMap: React.FC<VehiclesMapProps> = ({onVehicleClick}) => {
    const vehicles = store.vehicles;
    const isLoading = store.isLoading;


    let center: [number, number] = [59.95, 30.28];
    useLayoutEffect(() => {
        center =
            vehicles.length > 0
                ? [vehicles[0].latitude || 0, vehicles[0].longitude || 0]
                : [59.95, 30.28];

    }, [vehicles]);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Загрузка карты...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (vehicles.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Карта машин</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-gray-500 py-8">
                        <p>Нет машин для отображения на карте</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Карта машин ({vehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                    <MapContainer
                        center={center}
                        zoom={10}
                        style={{height: "100%", width: "100%"}}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {vehicles.map((vehicle: Vehicle) => (
                            <Marker
                                key={vehicle.id}
                                position={[vehicle.latitude, vehicle.longitude]}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[200px]">
                                        <h3 className="font-semibold text-lg mb-2">
                                            {vehicle.name} {vehicle.model}

                                        </h3>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Год:</span>
                                                <Badge variant="secondary">{vehicle.year}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Цвет:</span>
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className="w-3 h-3 rounded-full border"
                                                        style={{backgroundColor: vehicle.color}}
                                                    />
                                                    <span className="capitalize">{vehicle.color}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Цена:</span>
                                                <span className="font-semibold text-green-600">
                          ${vehicle.price.toLocaleString()}
                        </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Координаты: {vehicle.latitude.toFixed(4)},{" "}
                                                {vehicle.longitude.toFixed(4)}
                                            </div>
                                            <div>
                                                <Button
                                                    onClick={() => onVehicleClick?.(vehicle)}
                                                    variant="outline"
                                                    className="h-8 p-4 flex items-center justify-center"
                                                >
                                                    <Pencil className="w-3 h-3 mx-1"/>

                                                    Редактировать машину
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </CardContent>
        </Card>
    );
};
