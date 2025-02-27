// components/UploadModal.tsx
"use cilent";

import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
} from "@heroui/react";

type UploadModalProps = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleUpload: () => void;
	uploadMessage: string;
};

export default function UploadModal({
	isOpen,
	onOpenChange,
	handleFileChange,
	handleUpload,
	uploadMessage,
}: UploadModalProps) {
	return (
		<Modal
			backdrop="opaque"
			classNames={{
				body: "py-6",
				backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
				base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
				header: "border-b-[1px] border-[#292f46]",
				footer: "border-t-[1px] border-[#292f46]",
				closeButton: "hover:bg-white/5 active:bg-white/10",
			}}
			isOpen={isOpen}
			radius="lg"
			onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Upload Excel File
						</ModalHeader>
						<ModalBody>
							<Input
								type="file"
								accept=".xlsx"
								onChange={handleFileChange}
								fullWidth
								isClearable
								className="mt-4"
							/>
							<Button
								type="button"
								className="bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-800 mt-4"
								onPress={handleUpload}>
								Upload File
							</Button>
							{uploadMessage && (
								<div className="flex justify-center items-center mt-4">
									<p>{uploadMessage}</p>
								</div>
							)}
							<a
								href="/template.xlsx"
								download
								className="bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 mt-4 px-4 py-2 inline-block text-center">
								Download Template
							</a>
						</ModalBody>
						<ModalFooter>
							<Button
								className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
								onPress={onClose}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
