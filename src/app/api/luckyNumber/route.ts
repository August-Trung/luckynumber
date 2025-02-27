import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Định nghĩa kiểu dữ liệu cho JSON từ Excel
interface ExcelRow {
	"Lucky Number (Trong khoảng 100000 - 999999)": number;
	Avatar: string;
	[key: string]: string | number; // Giới hạn kiểu dữ liệu
}

// Đường dẫn file Excel
const getFilePath = () => path.join(process.cwd(), "data", "data.xlsx");

// Đọc dữ liệu từ file Excel
const readExcelFile = (): ExcelRow[] => {
	const filePath: string = getFilePath();
	const fileBuffer: Buffer = fs.readFileSync(filePath);

	// Load workbook từ buffer
	const workbook: xlsx.WorkBook = xlsx.read(fileBuffer, { type: "buffer" });

	// Lấy sheet đầu tiên và chuyển thành JSON
	const sheetName: string = workbook.SheetNames[0];
	const sheet: xlsx.WorkSheet = workbook.Sheets[sheetName];

	return xlsx.utils.sheet_to_json<ExcelRow>(sheet);
};

// Chuyển đổi số ngày trong Excel thành ngày tháng năm (dd/mm/yyyy)
const convertExcelDate = (excelDate: number): string => {
	const startDate = new Date(1900, 0, 1); // Ngày bắt đầu trong hệ thống ngày của Excel
	const convertedDate = new Date(
		startDate.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000
	); // Trừ 1 ngày vì Excel tính sai năm nhuận
	const day = String(convertedDate.getDate()).padStart(2, "0");
	const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
	const year = convertedDate.getFullYear();
	return `${day}/${month}/${year}`;
};

const convertGoogleDriveUrl = (url: string): string => {
	// Trường hợp URL có dạng ?id=... (dạng mở)
	const idMatch = url.match(/id=([^&]+)/);
	if (idMatch && idMatch[1]) {
		return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
	}

	// Trường hợp URL có dạng /file/d/.../view
	const fileMatch = url.match(/\/file\/d\/([^/]+)/);
	if (fileMatch && fileMatch[1]) {
		return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
	}

	// Nếu không phải Google Drive URL, trả về URL ban đầu
	return url;
};

export const dynamic = "force-dynamic"; // Bắt buộc server-side execution

// API GET: Trả về số Lucky Number (Trong khoảng 100000 - 999999) ngẫu nhiên
export async function GET(req: Request): Promise<NextResponse> {
	try {
		const url = new URL(req.url);
		const luckyNumber = Number(url.searchParams.get("luckyNumber"));

		if (isNaN(luckyNumber)) {
			return NextResponse.json(
				{
					error: "Invalid Lucky Number (Trong khoảng 100000 - 999999)",
				},
				{ status: 400 }
			);
		}

		const data: ExcelRow[] = readExcelFile();

		// Chuyển đổi định dạng ngày tháng và Avatar
		const formattedData = data.map((row) => {
			if (
				typeof row["Ngày tháng năm sinh ( ghi rõ dd/mm/yyy )"] ===
				"number"
			) {
				row["Ngày tháng năm sinh ( ghi rõ dd/mm/yyy )"] =
					convertExcelDate(
						row["Ngày tháng năm sinh ( ghi rõ dd/mm/yyy )"]
					);
			}
			if (row["Avatar"]) {
				row["Avatar"] = convertGoogleDriveUrl(row["Avatar"]);
			}
			return row;
		});

		// Nếu không có luckyNumber, lấy số ngẫu nhiên
		const allNumbers: number[] = formattedData.map(
			(row) => row["Lucky Number (Trong khoảng 100000 - 999999)"]
		);
		const randomNumber: number =
			allNumbers[Math.floor(Math.random() * allNumbers.length)];
		const luckyRow = formattedData.find(
			(row) =>
				row["Lucky Number (Trong khoảng 100000 - 999999)"] ===
				randomNumber
		);

		if (!luckyRow) {
			return NextResponse.json(
				{
					error: "Lucky Number (Trong khoảng 100000 - 999999) not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({ randomNumber, luckyRow });
	} catch (error: unknown) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}

// API POST: Xử lý upload file
export async function POST(req: Request): Promise<NextResponse> {
	try {
		// Lấy dữ liệu file upload
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 }
			);
		}

		// Lưu file Excel vào thư mục `data`
		const buffer = Buffer.from(await file.arrayBuffer());
		const filePath: string = getFilePath();
		fs.writeFileSync(filePath, buffer);

		return NextResponse.json({ message: "File uploaded successfully!" });
	} catch (error: unknown) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
