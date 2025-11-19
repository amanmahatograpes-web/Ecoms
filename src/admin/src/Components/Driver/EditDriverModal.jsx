import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useGlobalContext } from "../../GlobalContext";

export default function EditDriverModal({ isOpen, onClose, driver }) {
    const { baseurl, token, accessToken, teams } = useGlobalContext();
    const [form, setForm] = useState({
        userType: "driver",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        teamId: "",
        transportType: "",
        transportDescription: "",
        licencePlate: "",
        tier: "",
    });

    useEffect(() => {
        if (driver && teams?.length > 0) {
            const matchedTeam = teams.find(team => team.team_name === driver.teamName);
            const resolvedTeamId = matchedTeam?.id || "";

            setForm({
                userType: "driver",
                firstName: driver.first_name || "",
                lastName: driver.last_name || "",
                email: driver.email || "",
                password: "",
                confirmPassword: "",
                teamId: resolvedTeamId, // this is now the ID
                transportType: driver.transport_type || "",
                transportDescription: driver.transport_description || "",
                licencePlate: driver.licence_plate || "",
                tier: driver.tier || "",
            });
        }
    }, [driver, teams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (form.password && form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const payload = {
            driverId: driver.driverId,
            userType: form.userType,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            //   teamId: '',
            teamId: form.teamId,
            transportType: form.transportType,
            transportDescription: form.transportDescription,
            licencePlate: form.licencePlate,
            tier: form.tier,
        };

        try {
            const response = await axios.post(
                `${baseurl}/api/Driver/v1.0/editDriver`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.responseCode === "00") {
                toast.success("Driver updated successfully");
                onClose();
            } else {
                toast.error(response.data.responseMessage || "Failed to update driver");
            }
        } catch (err) {
            toast.error("Error occurred while updating driver");
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Dialog.Content className="bg-white p-6 rounded-md max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 space-y-4">
                    <Dialog.Title className="text-lg font-semibold">Edit Driver</Dialog.Title>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
                        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded col-span-2" />
                        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="New Password" className="border p-2 rounded" />
                        <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password" className="border p-2 rounded" />
                        <select
                            name="teamId"
                            value={form.teamId}
                            onChange={handleChange}
                            className="border p-2 rounded col-span-2"
                        >
                            <option value="">Select Team</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.team_name}
                                </option>
                            ))}
                        </select>
                        <input name="transportType" value={form.transportType} onChange={handleChange} placeholder="Transport Type" className="border p-2 rounded" />
                        <input name="transportDescription" value={form.transportDescription} onChange={handleChange} placeholder="Transport Description" className="border p-2 rounded" />
                        <input name="licencePlate" value={form.licencePlate} onChange={handleChange} placeholder="License Plate" className="border p-2 rounded" />
                        <input name="tier" value={form.tier} onChange={handleChange} placeholder="Tier" className="border p-2 rounded" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Dialog.Close asChild>
                            <button className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
                        </Dialog.Close>
                        <button onClick={handleSubmit} className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">Save</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
