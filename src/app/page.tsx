// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import {
	Button,
	useDisclosure,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Image,
} from "@heroui/react";
import UploadModal from "../components/UploadModal"; // Import component mới
import LuckyNumberDetailsModal from "../components/LuckyNumberDetailsModal";

const AcmeLogo = () => {
	return <Image src="/logo.png" alt="Logo.png" width={32} height={60} />;
};

export default function Home() {
	const [randomNumber, setRandomNumber] = useState<number | null>(null);
	const [displayNumber, setDisplayNumber] = useState<number | null>(null);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [file, setFile] = useState<File | null>(null);
	const [uploadMessage, setUploadMessage] = useState<string>("");
	const [details, setDetails] = useState<Record<string, any> | null>(null);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isDetailsOpen,
		onOpen: onDetailsOpen,
		onOpenChange: onDetailsClose,
	} = useDisclosure();

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (isRunning && randomNumber === null) {
			interval = setInterval(() => {
				setDisplayNumber(
					Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
				);
			}, 100);
		}

		if (!isRunning && randomNumber === null && displayNumber !== null) {
			const fetchLuckyNumber = async () => {
				const response = await fetch(
					`/api/luckyNumber?luckyNumber=${displayNumber}`
				);
				const data = await response.json();
				setRandomNumber(
					data.luckyRow["Lucky Number (Trong khoảng 100000 - 999999)"]
				);
				setDetails(data.luckyRow); // Cập nhật thông tin chi tiết
				onDetailsOpen(); // Mở modal chi tiết
			};

			fetchLuckyNumber();
		}

		return () => {
			clearInterval(interval);
		};
	}, [isRunning, randomNumber, displayNumber, onDetailsOpen]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			alert("Please select a file first!");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/luckyNumber", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			setUploadMessage(data.message || data.error || "");
			setTimeout(() => setUploadMessage(""), 3000);
		} catch (error) {
			console.error("Upload failed:", error);
			setUploadMessage("Upload failed!");

			setTimeout(() => setUploadMessage(""), 3000);
		}
	};

	const handleStart = () => {
		setIsRunning(true);
		setRandomNumber(null);
		setDisplayNumber(null);
	};

	const handleStop = () => {
		setIsRunning(false);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white">
			{/* Header */}
			<header className="w-full text-center text-lg font-bold bg-opacity-50">
				<Navbar isBordered maxWidth="full" isBlurred>
					<NavbarBrand>
						<AcmeLogo />
					</NavbarBrand>
					<NavbarContent justify="end">
						<NavbarItem>
							<Button
								onPress={onOpen}
								color="primary"
								variant="flat"
								className="bg-purple-500 text-white font-bold shadow-lg hover:bg-purple-600">
								Upload Excel
							</Button>
						</NavbarItem>
					</NavbarContent>
				</Navbar>
				<h1 className="text-4xl py-4 font-bold tracking-wider">
					✨ Lucky Number ✨
				</h1>
				<p className="mt-2 text-sm text-gray-200">
					Tìm số may mắn của bạn ngay hôm nay!
				</p>
			</header>

			{/* Hero Section */}
			<main className="flex flex-col items-center">
				<div className="w-96 h-48 flex items-center justify-center bg-white bg-opacity-90 rounded-xl shadow-lg">
					<p className="text-5xl font-extrabold text-purple-700 animate-pulse">
						{randomNumber ?? displayNumber ?? "000000"}
					</p>
				</div>
				<div className="flex space-x-4 mt-6">
					<button
						className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
						onClick={handleStart}>
						Start
					</button>
					<button
						className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
						onClick={handleStop}>
						Stop
					</button>
				</div>

				{details && (
					<button
						className="mt-4 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-600"
						onClick={onDetailsOpen}>
						Xem lại thông tin
					</button>
				)}
			</main>

			{/* Footer */}
			<footer className="w-full py-4 text-center text-sm bg-opacity-50">
				<p className="text-gray-200">
					© 2025 Lucky Number Generator. All rights reserved.
				</p>
			</footer>
			{/* Sử dụng UploadModal ở đây */}
			<UploadModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				handleFileChange={handleFileChange}
				handleUpload={handleUpload}
				uploadMessage={uploadMessage}
			/>

			<LuckyNumberDetailsModal
				isOpen={isDetailsOpen}
				onClose={onDetailsClose}
				details={details || {}}
			/>
		</div>
	);
}
