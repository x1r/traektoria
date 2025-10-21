import React from "react";
import {store, Vehicle, VehicleSortField} from "@/lib/store/store";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table.tsx";
import {ArrowDown, ArrowUp, ArrowUpDown, Edit, Trash2} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import {observer} from "mobx-react-lite";

interface VehiclesListProps {
    onEditVehicle: (vehicle: Vehicle) => void;
}

export const VehiclesList: React.FC<VehiclesListProps> = observer(({
                                                                       onEditVehicle,
                                                                   }) => {
    const vehicles = store.sortedVehicles;
    const sortField = store.sortField;
    const sortOrder = store.sortOrder;
    const isLoading = store.isLoading;
    const error = store.error;


    const handleSort = (field: VehicleSortField) => {
        if (sortField === field) {
            store.setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            store.setSortField(field);
            store.setSortOrder("asc");
        }
    };

    const handleDelete = (id: number) => {
        store.deleteVehicle(id);
    };
    const getSortIcon = (field: VehicleSortField) => {
        if (sortField !== field) return <ArrowUpDown className="h-4 w-4"/>;
        return sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4"/>
        ) : (
            <ArrowDown className="h-4 w-4"/>
        );
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Загрузка машин...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-red-600">
                        <p>Ошибка загрузки: {error}</p>
                        <Button
                            onClick={() => store.fetchVehicles()}
                            className="mt-2"
                            variant="outline"
                        >
                            Попробовать снова
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <div className="flex gap-2 items-center">
                        <p>Список машин ({vehicles.length})</p>
                        <Button
                            variant={sortField === "year" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSort("year")}
                            className="flex items-center gap-2"
                        >
                            Год {getSortIcon("year")}
                        </Button>
                        <Button
                            variant={sortField === "price" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSort("price")}
                            className="flex items-center gap-2"
                        >
                            Цена {getSortIcon("price")}
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">


                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Марка</TableHead>
                                    <TableHead>Модель</TableHead>
                                    <TableHead>Год</TableHead>
                                    <TableHead>Цвет</TableHead>
                                    <TableHead>Цена</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell className="font-medium">
                                            {vehicle.name}
                                        </TableCell>
                                        <TableCell>{vehicle.model}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{vehicle.year}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{backgroundColor: vehicle.color}}
                                                />
                                                <span className="capitalize">{vehicle.color}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${vehicle.price.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEditVehicle(vehicle)}
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Удалить машину?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Вы уверены, что хотите удалить {vehicle.name}{" "}
                                                                {vehicle.model}? Это действие нельзя отменить.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(vehicle.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Удалить
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
