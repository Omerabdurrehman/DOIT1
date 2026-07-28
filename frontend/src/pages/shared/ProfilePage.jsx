import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    authService.getProfile().then(({ data }) => setProfile(data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.updateProfile(profile);
      setProfile(data);
      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-4">
        {["full_name", "phone_number", "address", "division", "district", "tehsil", "area"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/_/g, " ")}</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={profile[field] || ""}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="bg-primary text-white rounded px-4 py-2 font-semibold">
          Save Changes
        </button>
      </form>
    </div>
  );
}
