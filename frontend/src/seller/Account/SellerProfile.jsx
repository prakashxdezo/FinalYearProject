import { Avatar, Divider, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import { api } from "../../config/api";
import { fetchSellerProfile } from "../../Redux Toolkit/features/seller/sellerSlice";
import { uploadToCloudnary } from "../../util/uploadToCloudnary";

const SellerProfile = () => {
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((store) => store);
  const profile = seller.profile;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    sellerName: profile?.sellerName || "",
    mobile: profile?.mobile || "",
    profilePicture: profile?.profilePicture || "",
    businessName: profile?.businessDetails?.businessName || "",
    businessEmail: profile?.businessDetails?.businessEmail || "",
    businessAddress: profile?.businessDetails?.businessAddress || "",
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
      await api.patch(
        "/sellers/profile",
        {
          sellerName: form.sellerName,
          mobile: form.mobile,
          profilePicture: form.profilePicture,
          businessDetails: {
            businessName: form.businessName,
            businessEmail: form.businessEmail,
            businessAddress: form.businessAddress,
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        },
      );
      await dispatch(fetchSellerProfile(localStorage.getItem("jwt")));
      setEditing(false);
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      sellerName: profile?.sellerName || "",
      mobile: profile?.mobile || "",
      profilePicture: profile?.profilePicture || "",
      businessName: profile?.businessDetails?.businessName || "",
      businessEmail: profile?.businessDetails?.businessEmail || "",
      businessAddress: profile?.businessDetails?.businessAddress || "",
    });
    setEditing(false);
  };

  const avatar = form.profilePicture || profile?.profilePicture;

  const Field = ({ label, value }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="font-semibold text-gray-800 mt-0.5">
        {value || "Not provided"}
      </p>
    </div>
  );

  const Input = ({ label, fieldKey, placeholder }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
        value={form[fieldKey]}
        onChange={(e) => setForm((f) => ({ ...f, [fieldKey]: e.target.value }))}
        placeholder={placeholder || ""}
      />
    </div>
  );

  return (
    <div className="pb-20 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl text-gray-800">Seller Profile</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-teal-200 text-teal-600 hover:bg-teal-50 transition-colors"
          >
            <EditIcon style={{ fontSize: 16 }} /> Edit Profile
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              className="w-24 h-24 rounded-full object-cover border-2 border-teal-200"
              alt="profile"
            />
          ) : (
            <Avatar
              sx={{ width: 96, height: 96, bgcolor: "#14b8a6", fontSize: 32 }}
            >
              {profile?.sellerName?.charAt(0)?.toUpperCase() || "S"}
            </Avatar>
          )}
          {editing && (
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer shadow">
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
          <p className="font-bold text-gray-800 text-lg">
            {profile?.sellerName}
          </p>
          <p className="text-sm text-gray-400">{profile?.email}</p>
          <p className="text-xs text-teal-600 font-medium mt-0.5">
            {profile?.businessDetails?.businessName}
          </p>
        </div>
      </div>

      <Divider />

      {editing ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Personal Info
          </p>
          <Input label="Seller Name" fieldKey="sellerName" />
          <Input label="Mobile" fieldKey="mobile" placeholder="98XXXXXXXX" />

          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
            Business Info
          </p>
          <Input label="Business Name" fieldKey="businessName" />
          <Input label="Business Email" fieldKey="businessEmail" />
          <Input label="Business Address" fieldKey="businessAddress" />

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: "#14b8a6" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Personal Info
          </p>
          <Field label="Seller Name" value={profile?.sellerName} />
          <Field label="Email" value={profile?.email} />
          <Field label="Mobile" value={profile?.mobile} />

          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
            Business Info
          </p>
          <Field
            label="Business Name"
            value={profile?.businessDetails?.businessName}
          />
          <Field
            label="Business Email"
            value={profile?.businessDetails?.businessEmail}
          />
          <Field
            label="Business Address"
            value={profile?.businessDetails?.businessAddress}
          />
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
