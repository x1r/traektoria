import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Plus} from "lucide-react";
import {store, Vehicle} from "@/lib/store/store";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {toast} from "sonner";


interface VehicleFormProps {
    editingVehicle?: Vehicle | null;
    onClose: () => void;
}

interface FormDataType {
    name: string;
    model: string;
    year: number;
    color: string;
    price: number;
}

const COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "silver",
    "gray",
    "orange",
    "purple",
];

export const VehicleForm: React.FC<VehicleFormProps> = observer(({
                                                                     editingVehicle,
                                                                     onClose,
                                                                 }) => {

    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        model: "",
        year: new Date().getFullYear(),
        color: "red",
        price: 0,
    });

    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (editingVehicle) {
            setFormData({
                name: editingVehicle.name,
                model: editingVehicle.model,
                year: editingVehicle.year,
                color: editingVehicle.color,
                price: editingVehicle.price,
            });
            setIsOpen(true);
        } else {
            setFormData({
                name: "",
                model: "",
                year: new Date().getFullYear(),
                color: "red",
                price: 0,
            });
        }
    }, [editingVehicle]);

    const handleClose = () => {
        setFormData({
            name: "",
            model: "",
            year: new Date().getFullYear(),
            color: "red",
            price: 0,
        });
        setIsOpen(false);
        onClose();
        store.setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        store.setError("");

        if (!formData.name || !formData.model || !formData.price || !formData.year || !formData.color) {
            store.setError("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        try {
            if (editingVehicle) {
                const updatedVehicle: Vehicle = {
                    ...editingVehicle,
                    ...formData,
                };

                store.updateVehicle(updatedVehicle);

                toast.success("Автомобиль успешно обновлен!");

            } else {
                const newVehicle: Vehicle = {
                    ...formData,
                    id: Date.now() + Math.random(),
                    latitude: 0,
                    longitude: 0,
                };
                store.addVehicle(newVehicle);

                toast.success("Новый автомобиль успешно создан!");
            }

            handleClose();

        } catch (submitError) {
            console.error("Error submitting form:", submitError);
            store.setError("Произошла ошибка при сохранении данных.");
        }
    };

    const handleInputChange = (
        field: keyof FormDataType,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const displayError = store.error;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                {(!editingVehicle) && (<Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4"/>
                    Добавить машину
                </Button>)}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingVehicle ? "Редактировать машину" : "Добавить новую машину"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Марка *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Например: Toyota"
                            required
                        />
                    </div>

                    {!editingVehicle && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="model">Модель *</Label>
                                <Input
                                    id="model"
                                    value={formData.model}
                                    onChange={(e) => handleInputChange("model", e.target.value)}
                                    placeholder="Например: Camry"
                                    required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Год *</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => handleInputChange(
                                        "year",
                                        parseInt(e.target.value) || new Date().getFullYear()
                                    )}
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Цвет *</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) => handleInputChange("color", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите цвет"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLORS.map((color) => (
                                            <SelectItem key={color} value={color}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full border"
                                                        style={{backgroundColor: color}}/>
                                                    <span className="capitalize">{color}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>)}

                    <div className="space-y-2">
                        <Label htmlFor="price">Цена ($) *</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                                handleInputChange("price", parseFloat(e.target.value) || 0)
                            }
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                    </div>


                    {displayError && (
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                            {displayError}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={store.isLoading}>
                            {store.isLoading
                                ? "Сохранение..."
                                : editingVehicle
                                    ? "Обновить"
                                    : "Создать"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
});


