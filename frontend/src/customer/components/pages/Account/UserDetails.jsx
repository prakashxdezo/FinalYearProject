import React, { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { fetchUserProfile } from "../../../../Redux Toolkit/features/customer/userSlice";
import { api } from "../../../../config/api";
import { uploadToCloudnary } from "../../../../util/uploadToCloudnary";
import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress } from "@mui/material";

const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.user);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
    profilePicture: user?.profilePicture || "",
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudnary(file);
      setForm((f) => ({ ...f, profilePicture: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch("/api/users/profile", form);
      await dispatch(fetchUserProfile(localStorage.getItem("jwt")));
      setEditing(false);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const avatar = form.profilePicture || user?.profilePicture;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20">
          {avatar ? (
            <img
              src={avatar}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          {editing && (
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow">
              {uploading ? (
                <CircularProgress size={14} sx={{ color: "#fff" }} />
              ) : (
                <EditIcon style={{ fontSize: 14, color: "#fff" }} />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{user?.fullName}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {editing ? (
          <>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Full Name
              </label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Mobile
              </label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                value={form.mobile}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mobile: e.target.value }))
                }
                placeholder="98XXXXXXXX"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#4f46e5" }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({
                    fullName: user?.fullName || "",
                    mobile: user?.mobile || "",
                    profilePicture: user?.profilePicture || "",
                  });
                }}
                className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-medium">Full Name</p>
                <p className="font-semibold text-gray-800 mt-0.5">
                  {user?.fullName}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="font-semibold text-gray-800 mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-medium">Mobile</p>
                <p className="font-semibold text-gray-800 mt-0.5">
                  {user?.mobile || "Not provided"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <EditIcon style={{ fontSize: 16 }} /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
