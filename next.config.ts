/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone", // hoặc "default" thay vì "export"
	images: {
		domains: ["drive.google.com"], // Thêm domain cho phép Next.js xử lý ảnh
	},
	/* Các config khác có thể thêm ở đây */
};

export default nextConfig;
