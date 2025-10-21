import React, {useLayoutEffect, useState} from "react";
import {store, Vehicle} from "@/lib/store/store";
import {VehiclesList} from "@/components/vehicles/VehiclesList.tsx";
import {VehicleForm} from "@/components/vehicles/VehicleForm.tsx";
import {VehiclesMap} from "@/components/vehicles/VehiclesMap.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs.tsx";
import {List, Loader, Map} from "lucide-react";
import {toast} from "sonner";

export const VehiclesPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [activeTab, setActiveTab] = useState("list");

    useLayoutEffect(() => {

        setLoading(true);
        store.fetchVehicles();
        toast.success("Vehicles loaded");
        setLoading(false);
    }, []);

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        store.updateVehicle(vehicle);
    };

    const handleCloseForm = () => {
        setEditingVehicle(null);
    };

    const handleVehicleClick = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setActiveTab("list");
    };

    const handleRefresh = () => {
        setLoading(true);
        store.fetchVehicles();
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Управление машинами</h1>
                    <p className="text-gray-600 mt-1">
                        Просмотр, создание, редактирование и удаление машин
                    </p>
                </div>
                <div className="flex gap-2 ">
                    <Button onClick={handleRefresh} variant="outline" disabled={loading}>

                        {loading ? "Загрузка..." : (<div className="flex items-center gap-2">

                            <Loader className="h-4 w-4 mr-1"/>
                            Обновить
                        </div>)}
                    </Button>
                    <VehicleForm onClose={handleCloseForm}/>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <List className="h-4 w-4"/>
                        Список
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                        <Map className="h-4 w-4"/>
                        Карта
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <VehiclesList onEditVehicle={handleEditVehicle}/>
                </TabsContent>

                <TabsContent value="map" className="space-y-4">
                    <VehiclesMap onVehicleClick={handleVehicleClick}/>
                </TabsContent>
            </Tabs>

            {editingVehicle && (
                <VehicleForm
                    editingVehicle={editingVehicle}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};
