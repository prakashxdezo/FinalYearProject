export const uploadToCloudnary = async (file) => {
  const cloud_name = "dnaxobjjj";
  const upload_preset = "crystalThread";
  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", upload_preset); // FIXED
  data.append("cloud_name", cloud_name);

  const res = await fetch(url, {
    method: "POST",
    body: data,
  });

  const result = await res.json();

  if (result.error) {
    console.error("Cloudinary upload error:", result.error);
    throw new Error(result.error.message);
  }

  console.log("image url:", result.secure_url);
  return result.secure_url;
};
